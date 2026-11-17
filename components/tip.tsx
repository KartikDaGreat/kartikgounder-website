"use client"

import type * as React from "react"

import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type TipProps = {
  /** Visible tooltip text. The child must still carry its own `aria-label`. */
  label: string
  /** Optional keyboard shortcut shown after the label, e.g. "⌘K" or "T". */
  shortcut?: string
  side?: "top" | "right" | "bottom" | "left"
  /** A single focusable element (rendered via `asChild`). */
  children: React.ReactElement
}

export function Tip({ label, shortcut, side = "bottom", children }: TipProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={6}>
        {label}
        {shortcut && <Kbd className="ml-2">{shortcut}</Kbd>}
      </TooltipContent>
    </Tooltip>
  )
}
