"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Dices } from "lucide-react"
import { cn } from "@/lib/utils"
import { ALL_PALETTES } from "@/lib/themes"
import { Tip } from "@/components/tip"

/**
 * Re-rolls the color palette without a reload. The site already picks a random
 * palette per visit; this hands the dice to the visitor.
 */
export function ThemeDice({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  const [rolling, setRolling] = useState(false)

  const roll = () => {
    const current = document.documentElement.getAttribute("data-theme") ?? "default"
    let next = current
    while (next === current) {
      next = ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)]
    }

    // Let the colour cross-fade in globals.css run, then get out of its way.
    document.documentElement.classList.add("theme-transition")
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 350)

    if (next === "default") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", next)
    }

    // Every roulette palette is dark, and rolling opts back into the per-visit
    // roulette: forget any saved light/dark choice so the next visit rolls too.
    try {
      localStorage.removeItem("themeMode")
    } catch {
      // Storage blocked: nothing was saved to forget.
    }
    setTheme("dark")

    setRolling(true)
    window.setTimeout(() => setRolling(false), 300)
  }

  return (
    <Tip label="Roll a new palette">
      <button
        type="button"
        aria-label="Roll a new palette"
        onClick={roll}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground md:size-10",
          "transition-colors duration-150 hover:bg-secondary",
          className,
        )}
      >
        <Dices
          className={cn("size-4 transition-transform duration-300", rolling && "rotate-[360deg]")}
          aria-hidden
        />
      </button>
    </Tip>
  )
}
