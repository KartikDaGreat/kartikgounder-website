"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { User, FlaskConical, GraduationCap, Briefcase, Mail, Terminal, Menu, X } from "lucide-react"
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
]

type ArduinoStatus = {
  connected: boolean
  lastHeartbeat?: string
  latencyMs?: number
  logs?: string[]
  error?: string
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [arduinoStatus, setArduinoStatus] = useState<ArduinoStatus>({ connected: false, logs: [] })

  useEffect(() => {
    let cancelled = false

    const fetchStatus = async () => {
      try {
        const r = await fetch("/api/arduino/status", { cache: "no-store" })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = (await r.json()) as ArduinoStatus
        if (!cancelled) {
          setArduinoStatus({ ...data, connected: Boolean(data.connected), logs: data.logs || [] })
        }
      } catch (err: any) {
        if (!cancelled) {
          setArduinoStatus((prev) => ({
            ...prev,
            connected: false,
            error: err?.message || "Unable to reach Arduino",
          }))
        }
      }
    }

    fetchStatus()
    const intervalId = setInterval(fetchStatus, 5000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
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
          <div className="mt-auto pt-4 border-t border-sidebar-border space-y-3">
            <div className="px-3 py-2 rounded-md bg-sidebar-accent/40 border border-sidebar-border">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Arduino</span>
                <span
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full",
                    arduinoStatus.connected
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/40"
                      : "bg-rose-500/10 text-rose-300 border border-rose-400/40",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      arduinoStatus.connected ? "bg-emerald-400" : "bg-rose-400",
                    )}
                  />
                  {arduinoStatus.connected ? "Live" : "Offline"}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed space-y-1">
                <div className="flex items-center justify-between">
                  <span>Last heartbeat</span>
                  <span className="font-mono text-foreground">
                    {arduinoStatus.lastHeartbeat ? new Date(arduinoStatus.lastHeartbeat).toLocaleTimeString() : "--"}
                  </span>
                </div>
                {typeof arduinoStatus.latencyMs === "number" && (
                  <div className="flex items-center justify-between">
                    <span>Latency</span>
                    <span className="font-mono text-foreground">{arduinoStatus.latencyMs} ms</span>
                  </div>
                )}
                {arduinoStatus.error && <div className="text-rose-300/90">{arduinoStatus.error}</div>}
              </div>
              {arduinoStatus.logs && arduinoStatus.logs.length > 0 && (
                <div className="mt-3 rounded bg-sidebar border border-sidebar-border/60 max-h-24 overflow-y-auto text-[11px] text-muted-foreground p-2 space-y-1">
                  {arduinoStatus.logs.slice(0, 4).map((log, i) => (
                    <div key={i} className="truncate" title={log}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              <span className="whitespace-nowrap overflow-hidden">Theme changes on reload</span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
