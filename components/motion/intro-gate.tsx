"use client"

import { useEffect } from "react"

const INPUT_EVENTS = ["keydown", "pointerdown", "wheel", "touchstart"] as const

/**
 * Ends the Home intro. The intro is pure CSS, gated on `html:not([data-intro-seen])`
 * (see globals.css), so setting the attribute stops every intro animation and
 * leaves each element in its resting, final state. That happens when the
 * sequence finishes or when the visitor presses a key, clicks or scrolls, and
 * it is remembered for the rest of the visit.
 */
export function IntroGate({ duration = 3600 }: { duration?: number }) {
  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.introSeen) return

    const finish = () => {
      root.dataset.introSeen = "1"
      try {
        sessionStorage.setItem("intro-seen", "1")
      } catch {
        /* storage blocked: the intro may replay next load, which is harmless */
      }
    }

    const timer = window.setTimeout(finish, duration)
    INPUT_EVENTS.forEach((type) => window.addEventListener(type, finish, { once: true, passive: true }))

    // No finish() on unmount: Strict Mode runs this cleanup immediately in
    // development, and leaving Home always takes a click or key, which
    // already finished the intro above.
    return () => {
      window.clearTimeout(timer)
      INPUT_EVENTS.forEach((type) => window.removeEventListener(type, finish))
    }
  }, [duration])

  return null
}
