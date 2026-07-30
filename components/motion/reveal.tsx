"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"

/**
 * Scroll-triggered reveal for below-the-fold content.
 * Renders plain markup when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      data-reveal
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Mount animation for a section root: children with `variants={fadeUp}`
 * cascade in. Used instead of AnimatePresence because sections are lazily
 * loaded inside Suspense, where exit animations flicker.
 */
export function StaggerRoot({
  children,
  className,
  stagger = 0.06,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      data-reveal
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/** A single staggered child inside StaggerRoot. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div data-reveal className={className} variants={fadeUp}>
      {children}
    </motion.div>
  )
}
