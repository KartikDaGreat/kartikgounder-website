"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
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
  Search,
  Keyboard,
} from "lucide-react"
import type { SectionId } from "@/app/page"
import { Tip } from "@/components/tip"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useModKey } from "@/lib/platform"

interface SidebarProps {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
  onOpenPalette: () => void
  onOpenShortcuts: () => void
}

interface NavItem {
  id: SectionId
  label: string
  icon: React.ElementType
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
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
  "Press j / k to move around",
  "Ctrl+K knows where everything is",
  "A Raspberry Pi is serving part of this",
  "The terminal actually works, try it",
  "Nothing on the Lab page is mocked",
]

// Matches Tailwind's md breakpoint: from here up the aside is a static rail,
// not a drawer, so drawer behaviour (focus trap, Escape) must not apply.
const DRAWER_QUERY = "(max-width: 767px)"

export function Sidebar({ activeSection, onNavigate, onOpenPalette, onOpenShortcuts }: SidebarProps) {
  const mod = useModKey()
  const searchShortcut = mod === "⌘" ? "⌘K" : "Ctrl+K"
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  // Picked after mount so server and client render the same (empty) footer;
  // the reserved height means nothing shifts when the quip arrives.
  const [quipIndex, setQuipIndex] = useState<number | null>(null)
  useEffect(() => {
    setQuipIndex(Math.floor(Math.random() * footerQuips.length))
  }, [])
  const quip = quipIndex === null ? null : footerQuips[quipIndex].replace("Ctrl+K", searchShortcut)

  const closeDrawer = (restoreFocus: boolean) => {
    setMobileOpen(false)
    if (restoreFocus) menuButtonRef.current?.focus()
  }

  // Opening the drawer moves focus to the first nav item.
  useEffect(() => {
    if (!mobileOpen) return
    asideRef.current?.querySelector<HTMLElement>("nav button")?.focus()
  }, [mobileOpen])

  // Escape closes the drawer from anywhere, not only from inside it.
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[role="dialog"]')) {
        e.preventDefault()
        closeDrawer(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mobileOpen])

  // Widening past md while the drawer is open turns it into the rail; drop the
  // open state so the scrim and trap don't linger.
  useEffect(() => {
    if (!mobileOpen) return
    const mql = window.matchMedia(DRAWER_QUERY)
    const onChange = () => {
      if (!mql.matches) setMobileOpen(false)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [mobileOpen])

  // While the drawer is open, Tab and Shift+Tab cycle inside it.
  const trapFocus = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!mobileOpen || e.key !== "Tab" || !asideRef.current) return
    const focusable = Array.from(
      asideRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"),
    ).filter((el) => el.offsetParent !== null)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const openPalette = () => {
    setMobileOpen(false)
    onOpenPalette()
  }

  const openShortcuts = () => {
    setMobileOpen(false)
    onOpenShortcuts()
  }

  return (
    <>
      {/* Mobile top bar. mr-24 on the search button leaves room for the two
          44px theme buttons that the layout pins to the same corner. */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-1 border-b border-border bg-background px-2 md:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="site-nav"
          className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors duration-150 hover:bg-secondary"
        >
          {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
        <span className="truncate font-heading font-semibold text-foreground">Kartik Gounder</span>
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Search"
          className="ml-auto mr-24 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors duration-150 hover:bg-secondary"
        >
          <Search className="size-5" aria-hidden />
        </button>
      </header>

      {/* Mobile scrim */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" aria-hidden onClick={() => closeDrawer(true)} />
      )}

      <aside
        ref={asideRef}
        id="site-nav"
        aria-label="Site"
        onKeyDown={trapFocus}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar md:z-30 md:w-16 lg:w-56",
          "transition-[transform,visibility] duration-200",
          // Closed on mobile: off-screen and invisible, which also removes it
          // from the tab order. From md up it is always shown as a rail.
          mobileOpen ? "translate-x-0" : "invisible -translate-x-full md:visible md:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex-shrink-0 px-3 pt-6 pb-4 md:px-2 lg:px-3">
          <div className="px-3 md:hidden lg:block">
            <p className="font-heading text-base font-semibold text-foreground">Kartik Gounder</p>
            <p className="t-meta">Software engineer · New York</p>
          </div>
          <p
            className="hidden text-center font-heading text-base font-semibold text-foreground md:block lg:hidden"
            aria-hidden
          >
            K
          </p>

          {/* Search trigger: full button in the drawer and at lg, icon at md. */}
          <div className="mt-4">
            <button
              type="button"
              onClick={openPalette}
              className="btn btn-secondary w-full justify-between md:hidden lg:inline-flex"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Search className="size-4" aria-hidden />
                Search
              </span>
              <Kbd className="rounded-md font-mono">{searchShortcut}</Kbd>
            </button>
            <div className="hidden justify-center md:flex lg:hidden">
              <Tip label="Search" shortcut={searchShortcut} side="right">
                <button
                  type="button"
                  onClick={openPalette}
                  aria-label="Search"
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors duration-150 hover:bg-secondary md:size-10"
                >
                  <Search className="size-4" aria-hidden />
                </button>
              </Tip>
            </div>
          </div>
        </div>

        {/* min-h-0 + overflow lets the list scroll on short viewports
            instead of spilling into the footer. */}
        <nav aria-label="Sections" className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4 md:px-2 lg:px-3">
          {navGroups.map((navGroup) => (
            <div key={navGroup.label}>
              <p className="eyebrow mb-2 px-3 md:hidden lg:block">{navGroup.label}</p>
              <ul className="flex flex-col gap-1">
                {navGroup.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  const button = (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate(item.id)
                        setMobileOpen(false)
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium",
                        "transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "md:justify-center md:px-0 lg:justify-start lg:px-3",
                        isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span className="truncate md:sr-only lg:not-sr-only">{item.label}</span>
                    </button>
                  )
                  return (
                    <li key={item.id}>
                      <RailTip label={item.label}>{button}</RailTip>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-start gap-1 border-t border-sidebar-border px-3 py-3 md:justify-center md:px-2 lg:justify-start lg:px-3">
          <p className="min-h-8 flex-1 px-3 text-xs leading-4 text-muted-foreground md:hidden lg:block">{quip}</p>
          <Tip label="Keyboard shortcuts" shortcut="?" side="right">
            <button
              type="button"
              onClick={openShortcuts}
              aria-label="Keyboard shortcuts"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:size-10"
            >
              <Keyboard className="size-4" aria-hidden />
            </button>
          </Tip>
        </div>
      </aside>
    </>
  )
}

/**
 * Tooltip for rail items. Labels are visible in the drawer and at lg, so the
 * tooltip content is hidden there and only shows on the md icon rail. The
 * trigger stays mounted at every width (a media-query switch would remount
 * the buttons and drop focus).
 */
function RailTip({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={6} className="max-md:hidden lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
