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

type DonutPlace = {
  name: string
  address?: string
  placeId: string
  rating?: number
  userRatingsTotal?: number
}

type DonutLocation = {
  lat: number
  lng: number
  source: "device" | "ip"
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [arduinoStatus, setArduinoStatus] = useState<ArduinoStatus>({ connected: false, logs: [] })
  const [donutPlaces, setDonutPlaces] = useState<DonutPlace[]>([])
  const [donutLocation, setDonutLocation] = useState<DonutLocation | null>(null)
  const [donutLoading, setDonutLoading] = useState(false)
  const [donutError, setDonutError] = useState<string>("")

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

  const getDeviceLocation = (): Promise<DonutLocation | null> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: "device" })
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
      )
    })

  const getIpLocation = async (): Promise<DonutLocation | null> => {
    try {
      const r = await fetch("/api/location/ip", { cache: "no-store" })
      if (!r.ok) return null
      const data = await r.json()
      if (typeof data.lat !== "number" || typeof data.lng !== "number") return null
      return { lat: data.lat, lng: data.lng, source: "ip" }
    } catch {
      return null
    }
  }

  const loadDonutPlaces = async () => {
    setDonutLoading(true)
    setDonutError("")

    const deviceLocation = await getDeviceLocation()
    const location = deviceLocation || (await getIpLocation())

    if (!location) {
      setDonutError("Unable to resolve your location")
      setDonutLoading(false)
      return
    }

    try {
      setDonutLocation(location)
      const r = await fetch(`/api/places/donuts?lat=${location.lat}&lng=${location.lng}`, { cache: "no-store" })
      if (!r.ok) {
        setDonutError(`Donut search failed (HTTP ${r.status})`)
        setDonutPlaces([])
        return
      }
      const data = await r.json()
      setDonutPlaces(Array.isArray(data.places) ? data.places : [])
      if (Array.isArray(data.places) && data.places.length === 0) {
        setDonutError("No donut shops found nearby")
      }
    } catch (err: any) {
      setDonutError(err?.message || "Donut search failed")
      setDonutPlaces([])
    } finally {
      setDonutLoading(false)
    }
  }

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
            <div className="px-3 py-2 rounded-md bg-sidebar-accent/30 border border-sidebar-border">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Donut Finder</span>
                <button
                  onClick={loadDonutPlaces}
                  disabled={donutLoading}
                  className={cn(
                    "inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs transition",
                    donutLoading
                      ? "bg-muted text-muted-foreground border-border"
                      : "bg-rose-500/20 text-rose-200 border-rose-400/40 hover:bg-rose-500/30",
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-300 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                  {donutLoading ? "Finding..." : "Find donuts"}
                </button>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed space-y-1">
                {donutLocation && (
                  <div className="flex items-center justify-between">
                    <span>Location source</span>
                    <span className="font-mono text-foreground">
                      {donutLocation.source === "device" ? "Device" : "IP"}
                    </span>
                  </div>
                )}
                {donutError && <div className="text-rose-300/90">{donutError}</div>}
              </div>
              {donutPlaces.length > 0 && donutLocation && (
                <div className="mt-3 rounded bg-sidebar border border-sidebar-border/60 max-h-40 overflow-y-auto text-[11px] text-muted-foreground p-2 space-y-2">
                  {donutPlaces.map((place) => (
                    <div key={place.placeId} className="space-y-1">
                      <div className="text-foreground font-medium truncate" title={place.name}>
                        {place.name}
                      </div>
                      {place.address && <div className="truncate">{place.address}</div>}
                      <div className="flex items-center justify-between">
                        {typeof place.rating === "number" ? (
                          <span>
                            {place.rating.toFixed(1)} stars{place.userRatingsTotal ? ` (${place.userRatingsTotal})` : ""}
                          </span>
                        ) : (
                          <span>Rating unavailable</span>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${donutLocation.lat},${donutLocation.lng}&destination=place_id:${place.placeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] text-primary border-primary/40 hover:bg-primary/10"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
