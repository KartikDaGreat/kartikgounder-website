"use client"

import { useState } from "react"
import { RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Two-sided card. Desktop flips on hover, which a touch screen cannot do, so
 * this is a real button that also flips on tap, Enter and Space. The
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
        "flip block w-full text-left bg-card focus-visible:-outline-offset-2",
        className,
      )}
    >
      <div className="flip-inner">
        <div className="flip-face bg-card p-4 flex flex-col justify-center">
          {front}
          {/* Says the card has a back, since hover is not discoverable. */}
          <RotateCw aria-hidden className="absolute top-3 right-3 size-3 text-muted-foreground" />
        </div>
        <div className="flip-face flip-back bg-card p-4 flex flex-col justify-center">{back}</div>
      </div>
    </button>
  )
}
