"use client"

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from "react"

interface Command {
  input: string
  output: string | string[]
}

interface FileState {
  authenticated: boolean
  files: any[]
}

interface GameState {
  active: boolean
  type: "guess" | "rps" | "hangman" | null
  // Guess game
  targetNumber?: number
  guessAttempts?: number
  guessMax?: number
  // RPS game
  rpsWins?: number
  rpsLosses?: number
  rpsTies?: number
  rpsRounds?: number
  // Hangman game
  word?: string
  guessedLetters?: string[]
  wrongGuesses?: number
}

let gameState: GameState = { active: false, type: null }
let fileState: FileState = { authenticated: false, files: [] }

const HANGMAN_WORDS = [
  "python",
  "react",
  "nodejs",
  "docker",
  "github",
  "vercel",
  "nextjs",
  "typescript",
  "machine",
  "neural",
]

const drawHangman = (wrong: number): string[] => {
  const stages = [
    "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========",
  ]
  return stages[Math.min(wrong, 6)].split("\n")
}

const getWordDisplay = (word: string, guessed: string[]): string => {
  return `Word: ${word
    .split("")
    .map((c) => (guessed.includes(c) ? c : "_"))
    .join(" ")}`
}

const fetchFiles = async (): Promise<string | string[]> => {
  try {
    const r = await fetch("/api/storage/files")
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const files = await r.json()
    fileState.files = files
    return files.map((f: any) => `  ${f.name}  (${f.size} bytes)`)
  } catch (err: any) {
    return `Error fetching files: ${err?.message || "Unknown error"}`
  }
}

const resolveFilename = async (raw: string): Promise<string> => {
  const input = stripQuotes(raw)
  if (fileState.files.length === 0) {
    const r = await fetchFiles()
    if (typeof r === "string") return input
  }
  const exact = fileState.files.find((f) => f.name.toLowerCase() === input.toLowerCase())
  if (exact) return exact.name
  const partial = fileState.files.find((f) => f.name.toLowerCase().startsWith(input.toLowerCase()))
  return partial ? partial.name : input
}

const deleteFile = async (filename: string): Promise<string> => {
  try {
    const r = await fetch("/api/storage/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) {
      return data?.error ? `Error deleting file: ${data.error}` : `Error deleting file: HTTP ${r.status}`
    }
    return data.message || "File deleted"
  } catch (err: any) {
    return `Error deleting file: ${err?.message || "Unknown error"}`
  }
}

const moveFile = async (_from: string, _to: string): Promise<string> => {
  // Not implemented on upstream server
  return "Move not implemented on storage server"
}

const loginTerminal = async (password: string): Promise<string> => {
  try {
    const r = await fetch("/api/terminal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (r.ok) {
      fileState.authenticated = true
      return "✓ Authenticated! You can now use file commands: ls, upload, download, rm, mv"
    }
    const data = await r.json().catch(() => ({}))
    return data?.error || `Login failed (HTTP ${r.status})`
  } catch (err: any) {
    return `Login failed: ${err?.message || "Unknown error"}`
  }
}

const uploadFileWithProgress = (file: File, onProgress: (p: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/storage/upload")

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(`Uploaded ${file.name}`)
        } else {
          reject(new Error(`HTTP ${xhr.status}`))
        }
      }
    }

    const formData = new FormData()
    formData.append("file", file)
    xhr.send(formData)
  })
}

const stripQuotes = (str: string): string => {
  return str.replace(/^["']|["']$/g, "")
}

const downloadFile = async (filename: string): Promise<string> => {
  filename = stripQuotes(filename)
  if (typeof window === "undefined") return "Downloads are only available in the browser"
  try {
    const r = await fetch(`/api/storage/file?name=${encodeURIComponent(filename)}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const blob = await r.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return `Downloaded ${filename}`
  } catch (err: any) {
    return `Error downloading file: ${err?.message || "Unknown error"}`
  }
}

const getFileAutocomplete = (input: string): string[] => {
  if (fileState.files.length === 0) return []
  const parts = input.trim().split(" ")
  const cmd = parts[0].toLowerCase()
  
  // Only autocomplete for these commands
  const autocompleteCommands = ["download", "rm", "delete", "mv", "move"]
  if (!autocompleteCommands.includes(cmd) || parts.length < 2) return []
  
  const prefix = parts[parts.length - 1].toLowerCase()
  if (prefix.length === 0) return []
  
  // Find matching files
  const matches = fileState.files
    .filter((f: any) => f.name.toLowerCase().startsWith(prefix))
    .map((f: any) => f.name)
    .slice(0, 5) // Limit to 5 suggestions
  
  return matches
}

const executeCommand = (input: string): string | string[] | Promise<string | string[]> => {
  const [cmd, ...args] = input.trim().split(" ")
  const lowerCmd = cmd.toLowerCase()

  // Handle file management commands (require auth)
  if (lowerCmd === "login") {
    const password = args.join(" ")
    if (!password) return "Usage: login <password>"
    return loginTerminal(password)
  }

  if (lowerCmd === "logout") {
    fileState.authenticated = false
    return "Logged out"
  }

  if (fileState.authenticated) {
    if (lowerCmd === "ls" || lowerCmd === "list") {
      return (async () => {
        const files = await fetchFiles()
        return ["Files in storage:", ...(Array.isArray(files) ? files : [files])]
      })()
    }

    if (lowerCmd === "rm" || lowerCmd === "delete") {
      if (!args[0]) return "Usage: rm <filename>"
      return (async () => deleteFile(await resolveFilename(args.join(" " ))))()
    }

    if (lowerCmd === "mv" || lowerCmd === "move") {
      return "Move is not implemented on the storage server"
    }

    if (lowerCmd === "upload") {
      return "__UPLOAD__"
    }

    if (lowerCmd === "download") {
      if (!args[0]) return "Usage: download <filename>"
      return (async () => downloadFile(await resolveFilename(args.join(" " ))))()
    }
  }

  // Handle active games
  if (gameState.active) {
    if (lowerCmd === "quit" || lowerCmd === "exit" || lowerCmd === "q") {
      const type = gameState.type
      gameState = { active: false, type: null }
      return `Exited ${type} game. Type 'game' to play again!`
    }

    // Number guessing game
    if (gameState.type === "guess") {
      const guess = Number.parseInt(lowerCmd)
      if (isNaN(guess)) {
        return `Enter a number between 1 and ${gameState.guessMax}!`
      }

      gameState.guessAttempts = (gameState.guessAttempts || 0) + 1

      if (guess === gameState.targetNumber) {
        const attempts = gameState.guessAttempts
        gameState = { active: false, type: null }
        return [
          `🎉 Correct! The number was ${guess}!`,
          `You got it in ${attempts} ${attempts === 1 ? "try" : "tries"}!`,
          "",
          "Type 'guess' to play again!",
        ]
      } else if (guess < gameState.targetNumber!) {
        return `📈 Too low! Try higher. (Attempt ${gameState.guessAttempts})`
      } else {
        return `📉 Too high! Try lower. (Attempt ${gameState.guessAttempts})`
      }
    }

    // Rock Paper Scissors
    if (gameState.type === "rps") {
      const choices = ["rock", "paper", "scissors", "r", "p", "s"]
      const choiceMap: Record<string, string> = {
        r: "rock",
        p: "paper",
        s: "scissors",
        rock: "rock",
        paper: "paper",
        scissors: "scissors",
      }

      if (!choices.includes(lowerCmd)) {
        return "Enter: rock (r), paper (p), or scissors (s)"
      }

      const playerChoice = choiceMap[lowerCmd]
      const cpuChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)]

      let result: string
      if (playerChoice === cpuChoice) {
        gameState.rpsTies = (gameState.rpsTies || 0) + 1
        result = "🤝 Tie!"
      } else if (
        (playerChoice === "rock" && cpuChoice === "scissors") ||
        (playerChoice === "paper" && cpuChoice === "rock") ||
        (playerChoice === "scissors" && cpuChoice === "paper")
      ) {
        gameState.rpsWins = (gameState.rpsWins || 0) + 1
        result = "🎉 You win!"
      } else {
        gameState.rpsLosses = (gameState.rpsLosses || 0) + 1
        result = "😢 You lose!"
      }

      gameState.rpsRounds = (gameState.rpsRounds || 0) + 1

      if (gameState.rpsRounds >= 5) {
        const wins = gameState.rpsWins || 0
        const losses = gameState.rpsLosses || 0
        const ties = gameState.rpsTies || 0
        gameState = { active: false, type: null }
        return [
          `You: ${playerChoice.toUpperCase()} vs CPU: ${cpuChoice.toUpperCase()}`,
          result,
          "",
          "━━━ Final Score (5 rounds) ━━━",
          `Wins: ${wins} | Losses: ${losses} | Ties: ${ties}`,
          wins > losses ? "🏆 You won the match!" : wins < losses ? "💀 CPU won the match!" : "🤝 It's a draw!",
          "",
          "Type 'rps' to play again!",
        ]
      }

      return [
        `You: ${playerChoice.toUpperCase()} vs CPU: ${cpuChoice.toUpperCase()}`,
        result,
        "",
        `Score: ${gameState.rpsWins || 0}W - ${gameState.rpsLosses || 0}L - ${gameState.rpsTies || 0}T`,
        `Round ${gameState.rpsRounds}/5 - Enter: r/p/s`,
      ]
    }

    // Hangman game
    if (gameState.type === "hangman") {
      const letter = lowerCmd[0]
      if (!letter || !/[a-z]/.test(letter)) {
        return "Enter a single letter (a-z)!"
      }

      if (gameState.guessedLetters!.includes(letter)) {
        return `You already guessed '${letter}'! Try another.`
      }

      gameState.guessedLetters!.push(letter)

      if (!gameState.word!.includes(letter)) {
        gameState.wrongGuesses = (gameState.wrongGuesses || 0) + 1
      }

      const display = getWordDisplay(gameState.word!, gameState.guessedLetters!)
      const hangman = drawHangman(gameState.wrongGuesses || 0)

      // Check win
      if (!display.includes("_")) {
        const word = gameState.word
        gameState = { active: false, type: null }
        return [...hangman, "", `Word: ${word}`, "", "🎉 You won! Type 'hangman' to play again!"]
      }

      // Check lose
      if (gameState.wrongGuesses! >= 6) {
        const word = gameState.word
        gameState = { active: false, type: null }
        return [...hangman, "", `The word was: ${word}`, "", "💀 Game over! Type 'hangman' to play again!"]
      }

      return [
        ...hangman,
        "",
        `Word: ${display}`,
        `Guessed: ${gameState.guessedLetters!.join(", ")}`,
        `Wrong: ${gameState.wrongGuesses}/6`,
        "",
        "Enter a letter:",
      ]
    }
  }

  // Regular commands
  switch (lowerCmd) {
    case "help":
      return [
        "Available commands:",
        "  help      - Show this help",
        "  about     - About me",
        "  skills    - My skills",
        "  projects  - Recent projects",
        "  contact   - Contact info",
        "  game      - Play games!",
        "  login     - Login to file manager (requires password)",
        "  clear     - Clear terminal",
        "  date      - Current date",
        "  ls        - List sections",
        "",
        "File Commands (after login):",
        "  ls/list             - List files",
        "  rm/delete <file>    - Delete file",
        "  mv/move <from> <to> - Move/rename file",
        "  upload              - Upload file",
        "  download <file>     - Download file",
        "  logout              - Logout",
        "",
        "Tips:",
        "  • Press Tab to autocomplete file names in download/rm/mv commands",
        "  • Use arrow keys to navigate history or autocomplete suggestions",
      ]
    case "about":
      return [
        "╔══════════════════════════════════════════════╗",
        "║  Kartik Gounder                              ║",
        "║  MS Computer Science @ Columbia University   ║",
        "║  AI, ML & Healthcare Applications            ║",
        "╚══════════════════════════════════════════════╝",
      ]
    case "skills":
      return [
        "Languages:  C++, Python, Java, JavaScript, TypeScript",
        "ML/AI:      TensorFlow, PyTorch, Keras, Scikit-learn",
        "Backend:    Flask, Node.js, PostgreSQL, Vercel",
        "Tools:      Docker, AWS, Git, CI/CD",
      ]
    case "projects":
      return [
        "Recent Projects:",
        "├── On-Device Document Classification (Samsung)",
        "├── Psychological Counselling Chatbot",
        "├── Skin Cancer Detection (96.33% acc)",
        "└── Traffic Speed Detection System",
      ]
    case "contact":
      return [
        "Email:    kartikgounder@gmail.com",
        "Email 2:  hello@kartikgounder.com",
        "GitHub:   github.com/KartikDaGreat",
        "LinkedIn: linkedin.com/in/kartik-gounder",
      ]
    case "game":
      return [
        "🎮 Games",
        "━━━━━━━━",
        "",
        "  guess    - Number guessing (1-100)",
        "  rps      - Rock Paper Scissors (5 rounds)",
        "  hangman  - Classic word game",
        "",
        "Type a game name to start!",
      ]
    case "guess":
      gameState = {
        active: true,
        type: "guess",
        targetNumber: Math.floor(Math.random() * 100) + 1,
        guessAttempts: 0,
        guessMax: 100,
      }
      return [
        "🔢 Number Guessing Game",
        "━━━━━━━━━━━━━━━━━━━━━━",
        "",
        "I'm thinking of a number between 1 and 100.",
        "Enter your guess!",
        "",
        "Type 'quit' to exit.",
      ]
    case "rps":
      gameState = {
        active: true,
        type: "rps",
        rpsWins: 0,
        rpsLosses: 0,
        rpsTies: 0,
        rpsRounds: 0,
      }
      return [
        "✊✋✌️ Rock Paper Scissors",
        "━━━━━━━━━━━━━━━━━━━━━━━",
        "",
        "Best of 5 rounds!",
        "Enter: rock (r), paper (p), or scissors (s)",
        "",
        "Type 'quit' to exit.",
      ]
    case "hangman":
      const word = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]
      gameState = {
        active: true,
        type: "hangman",
        word,
        guessedLetters: [],
        wrongGuesses: 0,
      }
      return [
        "🎯 Hangman",
        "━━━━━━━━━━",
        "",
        ...drawHangman(0),
        "",
        `Word: ${getWordDisplay(word, [])}`,
        "",
        "Enter a letter to guess!",
        "Type 'quit' to exit.",
      ]
    case "clear":
      return "__CLEAR__"
    case "date":
      return new Date().toLocaleString()
    case "echo":
      return args.join(" ") || ""
    case "ls":
      return ["about/", "academics/", "research/", "experience/", "contact/", "terminal/"]
    case "whoami":
      return "visitor@kartik-portfolio"
    case "pwd":
      return "/home/kartik/portfolio"
    case "":
      return ""
    default:
      return `Command not found: ${cmd}. Type 'help' for commands.`
  }
}

export function TerminalSection() {
  const [history, setHistory] = useState<Command[]>([
    {
      input: "",
      output: [
        "Welcome to Kartik's Terminal",
        "Type 'help' for commands or 'login' to access file manager",
        "Type 'game' for games!",
        "",
      ],
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingUpload, setPendingUpload] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const updateLastHistoryOutput = useCallback((output: string | string[]) => {
    setHistory((prev) => {
      if (prev.length === 0) return prev
      const next = [...prev]
      next[next.length - 1] = { ...next[next.length - 1], output }
      return next
    })
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (pendingUpload && fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
      setPendingUpload(false)
    }
  }, [pendingUpload])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [suggestions])

  const handleSubmit = useCallback(() => {
    const result = executeCommand(currentInput)

    if (result instanceof Promise) {
      result.then((output) => {
        if (output === "__CLEAR__") {
          setHistory([])
        } else if (output === "__UPLOAD__") {
          setHistory((prev) => [...prev, { input: currentInput, output: "Select a file to upload..." }])
          setPendingUpload(true)
        } else {
          setHistory((prev) => [...prev, { input: currentInput, output }])
        }
      })
    } else {
      if (result === "__CLEAR__") {
        setHistory([])
      } else if (result === "__UPLOAD__") {
        setHistory((prev) => [...prev, { input: currentInput, output: "Select a file to upload..." }])
        setPendingUpload(true)
      } else {
        setHistory((prev) => [...prev, { input: currentInput, output: result }])
      }
    }

    setCurrentInput("")
    setHistoryIndex(-1)
  }, [currentInput])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      // Get autocomplete suggestions
      const newSuggestions = getFileAutocomplete(currentInput)
      setSuggestions(newSuggestions)
      setSelectedSuggestion(0)
      
      if (newSuggestions.length > 0) {
        // Autocomplete with the first suggestion
        const parts = currentInput.trim().split(" ")
        const newInput = [...parts.slice(0, -1), newSuggestions[0]].join(" ")
        setCurrentInput(newInput)
        setSuggestions([])
      }
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === "Enter") {
      if (suggestions.length > 0) {
        e.preventDefault()
        // Accept selected suggestion
        const parts = currentInput.trim().split(" ")
        const newInput = [...parts.slice(0, -1), suggestions[selectedSuggestion]].join(" ")
        setCurrentInput(newInput)
        setSuggestions([])
      } else {
        handleSubmit()
      }
    } else if (e.key === "Escape") {
      setSuggestions([])
    } else if (e.key === "ArrowUp" && suggestions.length === 0) {
      e.preventDefault()
      const commandHistory = history.filter((h) => h.input).map((h) => h.input)
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown" && suggestions.length === 0) {
      e.preventDefault()
      if (historyIndex > 0) {
        const commandHistory = history.filter((h) => h.input).map((h) => h.input)
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else {
        setHistoryIndex(-1)
        setCurrentInput("")
      }
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      setHistory((prev) => [...prev, { input: "upload", output: "No file selected" }])
      return
    }

    const file = files[0]
    setUploadingFile(file.name)
    setUploadProgress(0)
    setHistory((prev) => [...prev, { input: `upload ${file.name}`, output: `Uploading ${file.name} (0%)` }])

    try {
      const msg = await uploadFileWithProgress(file, (percent) => {
        setUploadProgress(percent)
        updateLastHistoryOutput(`Uploading ${file.name} (${percent}%)`)
      })
      setUploadProgress(100)
      updateLastHistoryOutput(msg)
    } catch (err: any) {
      updateLastHistoryOutput(`Error uploading file: ${err?.message || "Unknown error"}`)
    } finally {
      setUploadingFile(null)
      setUploadProgress(null)
      e.target.value = ""
    }
  }

  return (
    <section className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Terminal</h1>
      <p className="text-muted-foreground mb-8">Interactive command-line with games</p>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary border-b border-border">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">kartik@portfolio:~</span>
        </div>

        <div
          ref={terminalRef}
          className="p-4 h-[420px] overflow-y-auto font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((cmd, index) => (
            <div key={index} className="mb-2">
              {cmd.input && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">❯</span>
                  <span>{cmd.input}</span>
                </div>
              )}
              {cmd.output && (
                <div className="text-muted-foreground pl-4 whitespace-pre-wrap">
                  {Array.isArray(cmd.output) ? cmd.output.map((line, i) => <div key={i}>{line}</div>) : cmd.output}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="text-primary">❯</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => {
                  const value = e.target.value
                  setCurrentInput(value)
                  // Update suggestions as user types
                  if (fileState.authenticated) {
                    const newSuggestions = getFileAutocomplete(value)
                    setSuggestions(newSuggestions)
                    setSelectedSuggestion(0)
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none caret-primary"
                spellCheck={false}
                autoComplete="off"
              />
              {/* Autocomplete suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-secondary border border-border rounded shadow-lg z-10">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 text-sm cursor-pointer ${
                        idx === selectedSuggestion
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary/80"
                      }`}
                      onClick={() => {
                        const parts = currentInput.trim().split(" ")
                        const newInput = [...parts.slice(0, -1), suggestion].join(" ")
                        setCurrentInput(newInput)
                        setSuggestions([])
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="terminal-cursor w-2 h-5 bg-primary" />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">Tip: Use arrow keys for command history</p>

      {uploadProgress !== null && (
        <div className="mt-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1">
            <span>{uploadingFile ? `Uploading ${uploadingFile}` : "Uploading..."}</span>
            <span className="font-mono text-foreground">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
    </section>
  )
}
