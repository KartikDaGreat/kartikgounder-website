"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { useModKey } from "@/lib/platform"

interface ShortcutGroup {
  title: string
  shortcuts: { keys: string[]; description: string }[]
}

function shortcutGroups(mod: string): ShortcutGroup[] {
  return [
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
        { keys: [mod, "K"], description: "Open command palette" },
        { keys: ["?"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close overlay" },
      ],
    },
  ]
}

interface KeyboardShortcutsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const mod = useModKey()

  // "?" toggles the dialog, except while typing or while another dialog is up.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return
      }
      if (!open && document.querySelector('[role="dialog"]')) return
      e.preventDefault()
      onOpenChange(!open)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-xl bg-card shadow-(--shadow-overlay) sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">Keyboard shortcuts</DialogTitle>
          <DialogDescription>Press ? to toggle this dialog.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {shortcutGroups(mod).map((group) => (
            <section key={group.title} aria-labelledby={`shortcuts-${group.title}`}>
              <h3 id={`shortcuts-${group.title}`} className="eyebrow mb-2">
                {group.title}
              </h3>
              <dl className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between gap-4 text-sm">
                    <dt className="text-foreground/80">{shortcut.description}</dt>
                    <dd className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          {i > 0 && (
                            <span className="text-xs text-muted-foreground" aria-hidden>
                              +
                            </span>
                          )}
                          <Kbd className="min-w-6 rounded-md font-mono">{key}</Kbd>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
