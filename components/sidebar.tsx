"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { User, FlaskConical, GraduationCap, Briefcase, Mail, Terminal, Menu, X, HardDrive } from "lucide-react"
import type { SectionId } from "@/app/page"

interface SidebarProps {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
}

const navItems: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "about", label: "About Me", icon: User },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "research", label: "Research", icon: FlaskConical },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "storage", label: "Storage", icon: HardDrive },
]

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

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
          "fixed top-0 h-full bg-sidebar border-r border-sidebar-border z-40",
          "transition-all duration-300 ease-in-out",
          // Mobile: full width when open, hidden when closed
          mobileOpen ? "w-56 translate-x-0 left-0" : "-translate-x-full left-0",
          // Desktop: positioned relative to the centered container
          "md:translate-x-0 md:w-16 md:hover:w-56 md:left-8",
          "lg:w-56 lg:left-12",
        )}
        style={
          {
            // On larger screens, position sidebar at the left edge of the centered container
          }
        }
      >
        <nav className="flex flex-col h-full pt-16 md:pt-8 px-3 pb-8">
          {/* Logo/Name area */}
          <div className="mb-8 px-2 overflow-hidden">
            <span className="text-xl font-bold text-foreground whitespace-nowrap">
              K<span className="md:opacity-0 md:group-hover:opacity-100 lg:opacity-100 transition-opacity">artik</span>
            </span>
          </div>

          {/* Navigation items */}
          <ul className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => {
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
                      "text-base font-medium transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-accent text-primary",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden md:opacity-0 md:group-hover:opacity-100 lg:opacity-100">
                      {item.label}
                    </span>
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Theme indicator at bottom */}
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              <span className="whitespace-nowrap overflow-hidden">Theme changes on reload</span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
