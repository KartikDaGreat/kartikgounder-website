"use client"

import { useEffect, useState } from "react"
import { Dices } from "lucide-react"
import { cn } from "@/lib/utils"
import { ALL_PALETTES } from "@/components/theme-provider"

/**
 * Re-rolls the color palette without a reload. The site already picks a random
 * palette per visit; this hands the dice to the visitor.
 */
export function ThemeDice({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const roll = () => {
    const current = document.documentElement.getAttribute("data-theme") ?? "default"
    let next = current
    while (next === current) {
      next = ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)]
    }

    // Let the 1500ms color transition in globals.css run, then get out of its way.
    document.documentElement.classList.add("theme-transition")
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 1500)

    if (next === "default") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", next)
    }

    setRolling(true)
    window.setTimeout(() => setRolling(false), 600)
  }

  return (
    <button
      type="button"
      aria-label="Roll a new color palette"
      title="Roll a new color palette"
      onClick={roll}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background/80 backdrop-blur-sm shadow-xs",
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        className,
      )}
    >
      <Dices className={cn("w-4 h-4 transition-transform duration-500", rolling && "rotate-[360deg]")} />
    </button>
  )
}
