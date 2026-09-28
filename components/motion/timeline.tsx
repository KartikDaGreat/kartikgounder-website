"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, type Variants } from "motion/react"
import { EASE } from "@/lib/motion"

/**
 * The Building timeline draws itself as you scroll: the accent line grows down
 * the grey track, and each year dot and card appears when the line's tip
 * reaches it. The tip and the reveals share one threshold (REACH), so they
 * land together. Time is the one thing on this page that moves.
 */

/** Where in the viewport the line's tip sits, and where items reveal. */
const REACH = 0.85
const inView = { once: true, margin: `0px 0px -${Math.round((1 - REACH) * 100)}% 0px` } as const

export function TimelineTrack({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${REACH * 100}%`, `end ${REACH * 100}%`],
  })

  return (
    <div ref={ref} className={`relative border-l-2 border-border ${className ?? ""}`}>
      <motion.div
        aria-hidden
        className="timeline-progress absolute -left-[2px] top-0 bottom-0 w-[2px] bg-primary"
        style={{ scaleY: reduced ? 1 : scrollYProgress }}
      />
      {children}
    </div>
  )
}

const dot: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

/** A year marker that pops when the line reaches it. */
export function TimelineDot({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <span aria-hidden className={className} />
  return (
    <motion.span
      aria-hidden
      data-reveal
      className={className}
      variants={dot}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
    />
  )
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** A card that appears as the line passes it. Its TimelineBeat children follow a beat later. */
export function TimelineItem({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  if (reduced) return <div>{children}</div>
  return (
    <motion.div data-reveal variants={item} initial="hidden" whileInView="visible" viewport={inView}>
      {children}
    </motion.div>
  )
}

const beat: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.25 } },
}

/**
 * The evidence inside a card (its impact numbers) rises just after the card,
 * so the eye lands on it second. Inherits the parent item's reveal.
 */
export function TimelineBeat({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  if (reduced) return <>{children}</>
  return (
    <motion.div data-reveal variants={beat}>
      {children}
    </motion.div>
  )
}
