"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Home, GraduationCap, FlaskConical, Briefcase, FolderGit2, Mail, Terminal, Activity,
  Github, Linkedin, FileText, ArrowUpRight, Wrench, Search,
} from "lucide-react"
import type { SectionId } from "@/app/page"
import { projects } from "@/lib/projects"
import { basics } from "@/lib/profile"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

type Category = "navigation" | "links" | "projects"

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
  category: Category
}

const GROUPS: { category: Category; label: string }[] = [
  { category: "navigation", label: "Navigate" },
  { category: "links", label: "Links" },
  { category: "projects", label: "Projects" },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (section: SectionId) => void
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const setOpen = (next: boolean) => {
    if (!next) {
      setQuery("")
      setSelectedIndex(0)
    }
    onOpenChange(next)
  }

  const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  const commands: CommandItem[] = [
    { id: "home", label: "Hello", description: "About me", icon: Home, category: "navigation", action: () => onNavigate("home") },
    { id: "work", label: "Building", description: "Experience", icon: Briefcase, category: "navigation", action: () => onNavigate("work") },
    { id: "projects", label: "Projects", description: "Things I've built", icon: FolderGit2, category: "navigation", action: () => onNavigate("projects") },
    { id: "research", label: "Research", description: "Papers & patents", icon: FlaskConical, category: "navigation", action: () => onNavigate("research") },
    { id: "education", label: "Education", description: "Academics", icon: GraduationCap, category: "navigation", action: () => onNavigate("education") },
    { id: "contact", label: "Contact", icon: Mail, category: "navigation", action: () => onNavigate("contact") },
    { id: "terminal", label: "Terminal", description: "A working shell", icon: Terminal, category: "navigation", action: () => onNavigate("terminal") },
    { id: "lab", label: "Live Systems", description: "Real telemetry", icon: Activity, category: "navigation", action: () => onNavigate("lab") },
    { id: "setup", label: "Setup", description: "Uses / gear", icon: Wrench, category: "navigation", action: () => onNavigate("setup") },
    { id: "github", label: "GitHub", description: "KartikDaGreat", icon: Github, category: "links", action: () => openExternal(basics.github) },
    { id: "linkedin", label: "LinkedIn", description: "kartik-gounder", icon: Linkedin, category: "links", action: () => openExternal(basics.linkedin) },
    { id: "resume", label: "Resume", description: "Opens Google Drive", icon: FileText, category: "links", action: () => openExternal(basics.resume) },
    ...projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      description: p.technologies.slice(0, 3).join(", "),
      icon: ArrowUpRight,
      category: "projects" as const,
      action: () => router.push(`/projects/${p.slug}`, { transitionTypes: ["nav-forward"] }),
    })),
  ]

  const q = query.trim().toLowerCase()
  const filtered = q
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category.includes(q),
      )
    : commands

  // One ordered list drives both the rendered groups and the arrow-key index.
  const groups = GROUPS.map((g) => ({ ...g, items: filtered.filter((c) => c.category === g.category) })).filter(
    (g) => g.items.length > 0,
  )
  const flat = groups.flatMap((g) => g.items)
  const activeId = flat[selectedIndex] ? `cmd-opt-${selectedIndex}` : undefined

  const execute = (item: CommandItem) => {
    setOpen(false)
    item.action()
  }

  // Cmd/Ctrl+K toggles the palette from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return
      // Don't stack on top of another dialog (shortcuts, lightbox).
      if (!open && document.querySelector('[role="dialog"]')) return
      e.preventDefault()
      if (open) {
        setQuery("")
        setSelectedIndex(0)
      }
      onOpenChange(!open)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Keep the selected row in view as the arrow keys move it.
  useEffect(() => {
    if (!activeId) return
    listRef.current?.querySelector(`#${activeId}`)?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, flat.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (flat[selectedIndex]) execute(flat[selectedIndex])
    }
  }

  let index = -1

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="top-[20vh] translate-y-0 gap-0 overflow-hidden rounded-xl bg-card p-0 shadow-(--shadow-overlay)"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="text"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="cmd-list"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search sections, links, and projects"
            placeholder="Search sections, links, projects…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <Kbd className="hidden rounded-md font-mono sm:inline-flex">Esc</Kbd>
        </div>

        <div ref={listRef} role="listbox" id="cmd-list" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              No matches. Try &ldquo;projects&rdquo; or &ldquo;resume&rdquo;.
            </p>
          )}

          {groups.map((group) => (
            <div key={group.category} role="group" aria-labelledby={`cmd-group-${group.category}`} className="not-first:mt-2">
              <div id={`cmd-group-${group.category}`} className="px-2 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              {group.items.map((item) => {
                index += 1
                const i = index
                return (
                  <CommandRow
                    key={item.id}
                    item={item}
                    id={`cmd-opt-${i}`}
                    selected={i === selectedIndex}
                    onSelect={() => execute(item)}
                    onHover={() => setSelectedIndex(i)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3" aria-hidden>
            <span className="flex items-center gap-1"><Kbd className="rounded-md font-mono">↑↓</Kbd> navigate</span>
            <span className="flex items-center gap-1"><Kbd className="rounded-md font-mono">↵</Kbd> select</span>
          </div>
          <span aria-live="polite">{flat.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CommandRow({
  item,
  id,
  selected,
  onSelect,
  onHover,
}: {
  item: CommandItem
  id: string
  selected: boolean
  onSelect: () => void
  onHover: () => void
}) {
  const Icon = item.icon
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={onSelect}
      onMouseMove={selected ? undefined : onHover}
      className={cn(
        "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150",
        selected ? "bg-secondary text-foreground" : "text-foreground/80",
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="flex-1 truncate text-left">{item.label}</span>
      {item.description && <span className="max-w-36 truncate text-xs text-muted-foreground">{item.description}</span>}
    </div>
  )
}
