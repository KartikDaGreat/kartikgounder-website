"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * The same photo rendered four ways, all opaque prints rather than the
 * theme-painted masks the line art uses: these are tonal, so ink density means
 * brightness, and recoloring them for a dark palette would invert the image.
 */
const STYLES = [
  { id: "stipple", label: "stipple", note: "ink dots, denser where the photo is darker" },
  { id: "halftone", label: "halftone", note: "newsprint screen, dot size tracks tone" },
  { id: "hatch", label: "hatch", note: "engraver's cross-hatching, angles stack up in shadow" },
  { id: "poster", label: "poster", note: "four flat tones, screen-print style" },
] as const

/** Shown first. Kept separate from the list order, which sets button layout. */
const DEFAULT_STYLE = "poster"

type StyleId = (typeof STYLES)[number]["id"]

export function PortraitSwitcher({ className }: { className?: string }) {
  const [style, setStyle] = useState<StyleId>(DEFAULT_STYLE)
  const active = STYLES.find((s) => s.id === style)!

  return (
    <div className={cn("max-w-[240px]", className)}>
      <div className="rounded-lg border border-border bg-card p-2">
        {/*
          All four are rendered, with only the active one visible. Toggling then
          costs no network request and cannot flash a half-loaded image.
        */}
        <div className="relative aspect-square">
          {STYLES.map((s) => (
            <Image
              key={s.id}
              src={`/art/portrait-${s.id}.png`}
              alt={
                s.id === style
                  ? `Portrait of Kartik Gounder with the Manhattan skyline behind him, rendered as ${s.label}`
                  : ""
              }
              width={900}
              height={900}
              priority={s.id === DEFAULT_STYLE}
              aria-hidden={s.id !== style}
              className={cn(
                "absolute inset-0 w-full h-full rounded-sm transition-opacity duration-200",
                s.id === style ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      <div role="group" aria-label="Portrait style" className="mt-2 flex flex-wrap justify-center gap-1">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStyle(s.id)}
            aria-pressed={s.id === style}
            className={cn(
              // 44px tall on touch, 36px from md where a pointer is likely.
              "inline-flex items-center min-h-11 md:min-h-9 px-3 rounded-full text-xs font-mono border transition-colors duration-150",
              s.id === style
                ? "bg-primary/10 text-primary border-primary/40"
                : "text-muted-foreground border-border hover:text-foreground hover:border-primary/30",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* min-h-8 with a 16px line reserves exactly two lines, so a shorter note does not make the column jump. */}
      <p aria-live="polite" className="mt-2 min-h-8 text-xs leading-4 font-mono text-muted-foreground text-center">
        {active.note}
      </p>
    </div>
  )
}
