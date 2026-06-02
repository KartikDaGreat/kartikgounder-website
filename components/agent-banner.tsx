"use client"

import { useEffect, useRef, useState } from "react"

const agentLines = [
  { prefix: "agent", text: "Initializing trust-aware orchestration layer..." },
  { prefix: "index", text: "Building AST index over 500 SWE-bench tasks" },
  { prefix: "model", text: "Loading classifier — ambiguity_detector_v3.pkl" },
  { prefix: "eval", text: "Risk score: 0.12 → SAFE · confidence: 99.2%" },
  { prefix: "agent", text: "Routing request to LLM with context window: 8192" },
  { prefix: "llm", text: "Generating code for: merge_intervals.py" },
  { prefix: "ast", text: "Parsing output → 3 functions, 0 syntax errors" },
  { prefix: "eval", text: "Composite trust score: 0.94 → AUTO-APPROVE" },
  { prefix: "agent", text: "Switching to privacy analysis pipeline..." },
  { prefix: "rules", text: "Evaluating 11 constraints against 10 PETs" },
  { prefix: "match", text: "Recommended: Differential Privacy (score: 0.89)" },
  { prefix: "agent", text: "Deploying skin cancer ensemble — 3 models" },
  { prefix: "model", text: "ResNet50 ✓  EfficientNet ✓  MobileNet ✓" },
  { prefix: "eval", text: "Ensemble accuracy: 96.33% on validation set" },
  { prefix: "agent", text: "Running adversarial interview simulation..." },
  { prefix: "llm", text: "Bluff detection: analyzing response coherence" },
  { prefix: "eval", text: "Knowledge gap found → escalating difficulty" },
  { prefix: "agent", text: "Processing document classification request" },
  { prefix: "model", text: "CNN forward pass — 3.7M params, latency: 12ms" },
  { prefix: "eval", text: "Class: invoice · confidence: 0.97 → ACCEPT" },
]

const prefixColors: Record<string, string> = {
  agent: "text-emerald-400",
  model: "text-blue-400",
  eval: "text-amber-400",
  llm: "text-purple-400",
  ast: "text-cyan-400",
  index: "text-teal-400",
  rules: "text-orange-400",
  match: "text-green-400",
}

export function AgentBanner() {
  const [lines, setLines] = useState<typeof agentLines>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTyping) return

    const currentLine = agentLines[currentIndex % agentLines.length]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= currentLine.text.length) {
        setDisplayText(currentLine.text.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setLines((prev) => {
            const next = [...prev, currentLine]
            return next.length > 6 ? next.slice(-6) : next
          })
          setDisplayText("")
          setCurrentIndex((prev) => prev + 1)
        }, 300)
      }
    }, 18)

    return () => clearInterval(typeInterval)
  }, [currentIndex, isTyping])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines, displayText])

  const currentLine = agentLines[currentIndex % agentLines.length]

  return (
    <div className="rounded-lg border border-border bg-[oklch(0.10_0.01_250)] overflow-hidden font-mono text-xs">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[oklch(0.08_0.01_250)] border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
          </div>
          <span className="text-muted-foreground text-[10px] ml-1">agent-orchestrator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            live
          </span>
        </div>
      </div>

      {/* Terminal content */}
      <div ref={containerRef} className="p-3 h-[140px] overflow-hidden">
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2 opacity-50">
              <span className={`${prefixColors[line.prefix] || "text-muted-foreground"} flex-shrink-0`}>
                [{line.prefix}]
              </span>
              <span className="text-foreground/70">{line.text}</span>
            </div>
          ))}
          {/* Currently typing line */}
          <div className="flex gap-2">
            <span className={`${prefixColors[currentLine.prefix] || "text-muted-foreground"} flex-shrink-0`}>
              [{currentLine.prefix}]
            </span>
            <span className="text-foreground/90">
              {displayText}
              <span className="inline-block w-[6px] h-[14px] bg-primary ml-0.5 animate-pulse" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
