"use client"

import { useState, useEffect } from "react"

interface ShortcutGroup {
  title: string
  shortcuts: { keys: string[]; description: string }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["j"], description: "Next section" },
      { keys: ["k"], description: "Previous section" },
      { keys: ["1-9"], description: "Jump to section by number" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Open command palette" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close overlay" },
    ],
  },
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-sm mx-4 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Press ? to toggle this overlay</p>
        </div>

        <div className="px-5 py-4 space-y-5">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {group.title}
              </h4>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground/80">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          {i > 0 && <span className="text-muted-foreground mx-0.5">+</span>}
                          <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded border border-border min-w-[24px] justify-center">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
