"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

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

export function DonutFinder() {
  const [places, setPlaces] = useState<DonutPlace[]>([])
  const [location, setLocation] = useState<DonutLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [open, setOpen] = useState(false)

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

  const loadPlaces = async () => {
    setLoading(true)
    setError("")

    const deviceLocation = await getDeviceLocation()
    const loc = deviceLocation || (await getIpLocation())

    if (!loc) {
      setError("Unable to resolve your location")
      setLoading(false)
      return
    }

    try {
      setLocation(loc)
      const r = await fetch(`/api/places/donuts?lat=${loc.lat}&lng=${loc.lng}`, { cache: "no-store" })
      const data = await r.json()
      if (!r.ok) {
        setError(data?.error || `Donut search failed (HTTP ${r.status})`)
        setPlaces([])
        return
      }
      setPlaces(Array.isArray(data.places) ? data.places : [])
      if (Array.isArray(data.places) && data.places.length === 0) {
        setError("No donut shops found nearby")
      }
    } catch (err: any) {
      setError(err?.message || "Donut search failed")
      setPlaces([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    if (places.length === 0 && !loading) {
      loadPlaces()
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Donut Finder</h3>
          <button
            onClick={handleOpen}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition",
              loading
                ? "bg-muted text-muted-foreground border-border"
                : "bg-rose-500/15 text-rose-300 border-rose-400/40 hover:bg-rose-500/25",
            )}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300" />
            {loading ? "Finding..." : "Find donuts"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Finds the nearest donut shops to you via the Google Places API. Device location first, IP fallback.
          Every engineer needs a snack endpoint.
        </p>
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          {location && (
            <div className="flex items-center justify-between">
              <span>Location source</span>
              <span className="font-mono text-foreground">{location.source === "device" ? "Device" : "IP"}</span>
            </div>
          )}
          {error && <div className="text-rose-300/90">{error}</div>}
          {places.length > 0 && (
            <button onClick={() => setOpen(true)} className="text-primary hover:underline">
              View {places.length} results
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold">Donut Finder</h3>
              <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
              {loading && <p className="text-sm text-muted-foreground">Finding nearby donut shops...</p>}
              {!loading && error && <p className="text-sm text-rose-300/90">{error}</p>}
              {!loading && !error && places.length === 0 && (
                <p className="text-sm text-muted-foreground">No results yet.</p>
              )}
              {places.length > 0 && location && (
                <div className="space-y-3">
                  {places.map((place) => (
                    <div key={place.placeId} className="rounded-md border border-border/60 p-3">
                      <div className="text-sm font-medium text-foreground" title={place.name}>
                        {place.name}
                      </div>
                      {place.address && <div className="text-xs text-muted-foreground mt-1">{place.address}</div>}
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        {typeof place.rating === "number" ? (
                          <span>
                            {place.rating.toFixed(1)} stars{place.userRatingsTotal ? ` (${place.userRatingsTotal})` : ""}
                          </span>
                        ) : (
                          <span>Rating unavailable</span>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${encodeURIComponent(place.address || place.name)}&destination_place_id=${place.placeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-primary border-primary/40 hover:bg-primary/10"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
