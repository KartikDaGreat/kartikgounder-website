"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  User, GraduationCap, FlaskConical, Briefcase, Mail, Terminal, Activity,
  Github, Linkedin, Download, ExternalLink, Wrench, Search,
} from "lucide-react"
import type { SectionId } from "@/app/page"
import { projects } from "@/lib/projects"

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
  category: "navigation" | "links" | "projects"
}

interface CommandPaletteProps {
  onNavigate: (section: SectionId) => void
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands: CommandItem[] = [
    { id: "about", label: "About Me", icon: User, category: "navigation", action: () => onNavigate("about") },
    { id: "experience", label: "Experience", icon: Briefcase, category: "navigation", action: () => onNavigate("experience") },
    { id: "research", label: "Research", icon: FlaskConical, category: "navigation", action: () => onNavigate("research") },
    { id: "academics", label: "Academics", icon: GraduationCap, category: "navigation", action: () => onNavigate("academics") },
    { id: "contact", label: "Contact", icon: Mail, category: "navigation", action: () => onNavigate("contact") },
    { id: "terminal", label: "Terminal", icon: Terminal, category: "navigation", action: () => onNavigate("terminal") },
    { id: "systems", label: "Systems", icon: Activity, category: "navigation", action: () => onNavigate("systems") },
    { id: "uses", label: "Uses", icon: Wrench, category: "navigation", action: () => onNavigate("uses") },
    { id: "github", label: "GitHub", description: "KartikDaGreat", icon: Github, category: "links", action: () => window.open("https://github.com/KartikDaGreat", "_blank") },
    { id: "linkedin", label: "LinkedIn", description: "kartik-gounder", icon: Linkedin, category: "links", action: () => window.open("https://www.linkedin.com/in/kartik-gounder", "_blank") },
    { id: "resume", label: "Resume", description: "Download PDF", icon: Download, category: "links", action: () => window.open("https://drive.google.com/file/d/1RDCJcs4V8BLVaDjqGEFXjoqk6KzF-AXi/view?usp=sharing", "_blank") },
    ...projects.slice(0, 8).map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      description: p.technologies.slice(0, 3).join(", "),
      icon: ExternalLink,
      category: "projects" as const,
      action: () => window.open(`/projects/${p.slug}`, "_self"),
    })),
  ]

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  const grouped = {
    navigation: filtered.filter((c) => c.category === "navigation"),
    links: filtered.filter((c) => c.category === "links"),
    projects: filtered.filter((c) => c.category === "projects"),
  }

  const flatFiltered = [...grouped.navigation, ...grouped.links, ...grouped.projects]

  const execute = useCallback(
    (item: CommandItem) => {
      setOpen(false)
      setQuery("")
      item.action()
    },
    []
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
        setQuery("")
        setSelectedIndex(0)
      }
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selected) {
        selected.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (flatFiltered[selectedIndex]) {
        execute(flatFiltered[selectedIndex])
      }
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => { setOpen(false); setQuery("") }}
      />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, sections, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-secondary rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[300px] overflow-y-auto p-2">
          {flatFiltered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No results found</div>
          )}

          {grouped.navigation.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Navigate
              </div>
              {grouped.navigation.map((item) => {
                const globalIndex = flatFiltered.indexOf(item)
                return <CommandRow key={item.id} item={item} selected={globalIndex === selectedIndex} index={globalIndex} onClick={() => execute(item)} />
              })}
            </>
          )}

          {grouped.links.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                Links
              </div>
              {grouped.links.map((item) => {
                const globalIndex = flatFiltered.indexOf(item)
                return <CommandRow key={item.id} item={item} selected={globalIndex === selectedIndex} index={globalIndex} onClick={() => execute(item)} />
              })}
            </>
          )}

          {grouped.projects.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                Projects
              </div>
              {grouped.projects.map((item) => {
                const globalIndex = flatFiltered.indexOf(item)
                return <CommandRow key={item.id} item={item} selected={globalIndex === selectedIndex} index={globalIndex} onClick={() => execute(item)} />
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-secondary rounded border border-border font-mono">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-secondary rounded border border-border font-mono">↵</kbd> select</span>
          </div>
          <span>{flatFiltered.length} results</span>
        </div>
      </div>
    </div>
  )
}

function CommandRow({
  item,
  selected,
  index,
  onClick,
}: {
  item: CommandItem
  selected: boolean
  index: number
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      data-index={index}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        selected ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary/50"
      }`}
    >
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.description && (
        <span className="text-xs text-muted-foreground truncate max-w-[140px]">{item.description}</span>
      )}
    </button>
  )
}
