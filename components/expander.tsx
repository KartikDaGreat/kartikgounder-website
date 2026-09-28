"use client"

import { startTransition, useState, ViewTransition } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "+n more" fold. Server renders collapsed, so there is nothing to mismatch at
 * hydration time; the hidden content only mounts after a click.
 *
 * The toggle runs in a transition, so the extra lines fade in and out
 * (expand-in / collapse-out in globals.css), and any `update` boundaries
 * below, like the Building timeline's cards, glide to their new position.
 */
export function Expander({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      {open && (
        <ViewTransition enter="expand-in" exit="collapse-out" default="none">
          {children}
        </ViewTransition>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => startTransition(() => setOpen((v) => !v))}
        className="inline-flex items-center gap-1 mt-1 min-h-9 pr-3 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
        {open ? "show less" : label}
      </button>
    </div>
  )
}
