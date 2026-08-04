"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "+n more" fold. Server renders collapsed, so there is nothing to mismatch at
 * hydration time; the hidden content only mounts after a click.
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
      {open && children}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
        {open ? "show less" : label}
      </button>
    </div>
  )
}
