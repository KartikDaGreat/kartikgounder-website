"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  FlaskConical,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Mail,
  Terminal,
  Activity,
  Menu,
  X,
  Wrench,
} from "lucide-react"
import type { SectionId } from "@/app/page"

interface SidebarProps {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
}

interface NavGroup {
  label: string
  items: { id: SectionId; label: string; icon: React.ElementType }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Journey",
    items: [
      { id: "home", label: "Hello", icon: Home },
      { id: "work", label: "Building", icon: Briefcase },
      { id: "projects", label: "Projects", icon: FolderGit2 },
      { id: "research", label: "Research", icon: FlaskConical },
      { id: "education", label: "Education", icon: GraduationCap },
      { id: "contact", label: "Contact", icon: Mail },
    ],
  },
  {
    label: "The Lab",
    items: [
      { id: "terminal", label: "Terminal", icon: Terminal },
      { id: "lab", label: "Live Systems", icon: Activity },
      { id: "setup", label: "Setup", icon: Wrench },
    ],
  },
]

// One of these lands in the footer per visit. All true, none load-bearing.
const footerQuips = [
  "Theme changes on reload",
  "Press j / k to move around",
  "Ctrl+K knows where everything is",
  "A Raspberry Pi is serving part of this",
  "The terminal actually works, try it",
  "Nothing on the Lab page is mocked",
]

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Server-render the first quip, shuffle after mount to dodge hydration
  // mismatches: Math.random during render would differ between server and client.
  const [quip, setQuip] = useState(footerQuips[0])
  useEffect(() => {
    setQuip(footerQuips[Math.floor(Math.random() * footerQuips.length)])
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-sidebar border border-sidebar-border md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "group fixed top-0 h-full bg-sidebar border-r border-sidebar-border z-40",
          "transition-all duration-300 ease-in-out",
          // Mobile: full width when open, hidden when closed
          mobileOpen ? "w-56 translate-x-0 left-0" : "-translate-x-full left-0",
          // Desktop: positioned relative to the centered container
          "md:translate-x-0 md:w-16 md:hover:w-56 md:left-8",
          "lg:w-56 lg:left-12",
        )}
      >
        <nav className="flex flex-col h-full pt-16 md:pt-8 px-3 pb-6">
          {/* Logo/Name area */}
          <div className="mb-6 px-2 overflow-hidden">
            <span className="text-xl font-bold text-foreground whitespace-nowrap">
              K<span className="md:opacity-0 md:group-hover:opacity-100 lg:opacity-100 transition-opacity">artik</span>
            </span>
          </div>

          {/* Navigation groups. min-h-0 + overflow lets this list scroll on
              short viewports instead of spilling into the footer. */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
            {navGroups.map((navGroup) => (
              <div key={navGroup.label}>
                {/* leading-none: the label must not inherit the body's 28px
                    line-height, which overflowed the row onto the first item. */}
                <div className="px-3 mb-2">
                  <span className="block text-[10px] leading-none font-mono uppercase tracking-widest text-muted-foreground whitespace-nowrap md:opacity-0 md:group-hover:opacity-100 lg:opacity-100 transition-opacity">
                    {navGroup.label}
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {navGroup.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            onNavigate(item.id)
                            setMobileOpen(false)
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md",
                            "text-sm font-medium transition-colors",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-sidebar-accent text-primary",
                          )}
                        >
                          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                          <span className="whitespace-nowrap overflow-hidden md:opacity-0 md:group-hover:opacity-100 lg:opacity-100">
                            {item.label}
                          </span>
                          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 pt-3 border-t border-sidebar-border">
            <div className="px-3 text-[11px] leading-tight text-muted-foreground whitespace-nowrap overflow-hidden md:opacity-0 md:group-hover:opacity-100 lg:opacity-100 transition-opacity">
              {quip}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
