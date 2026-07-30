import type { Variants } from "motion/react"

/**
 * Shared motion vocabulary. Everything animates transform + opacity only —
 * colors belong to the 1500ms theme transition in globals.css, and animating
 * them here would fight it.
 */

export const EASE = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } },
}

export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}

/** Trigger slightly before the element is fully on screen, and only once. */
export const viewportOnce = { once: true, margin: "-40px" } as const
