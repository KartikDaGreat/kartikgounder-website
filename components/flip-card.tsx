"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Two-sided card. Desktop flips on hover, which a touch screen cannot do, so
 * this is a real button that also flips on tap and on keyboard focus. The
 * transform itself lives in CSS (.flip / .flip-inner in globals.css) so the
 * hover path costs no JavaScript.
 */
export function FlipCard({
  front,
  back,
  label,
  className,
}: {
  front: React.ReactNode
  back: React.ReactNode
  /** Full sentence for screen readers, since the visual is two faces. */
  label: string
  className?: string
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={flipped}
      data-flipped={flipped}
      onClick={() => setFlipped((v) => !v)}
      className={cn(
        "flip block w-full text-left bg-card outline-none",
        "focus-visible:ring-1 focus-visible:ring-primary/50",
        className,
      )}
    >
      <div className="flip-inner">
        <div className="flip-face bg-card px-4 py-3.5 flex flex-col justify-center">{front}</div>
        <div className="flip-face flip-back bg-card px-4 py-3 flex flex-col justify-center">{back}</div>
      </div>
    </button>
  )
}
