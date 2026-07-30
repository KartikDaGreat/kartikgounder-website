"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "motion/react"

/** Honors the OS "reduce motion" setting for every animation on the site. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
