"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tip } from "@/components/tip"

const LIGHT_PALETTE = "light-extreme"

// The palette script (and the dice) write data-theme directly, so the DOM is
// the source of truth for what is on screen. next-themes' resolvedTheme is not:
// it can say "dark" while a light palette shows, or the reverse.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  return () => observer.disconnect()
}
const getSnapshot = () => document.documentElement.getAttribute("data-theme") === LIGHT_PALETTE
// Every palette but one is dark, so assume dark until hydration reads the DOM.
const getServerSnapshot = () => false

function saveMode(mode: "light" | "dark") {
  try {
    localStorage.setItem("themeMode", mode)
  } catch {
    // Storage blocked (private mode): the choice lasts for this page view only.
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    // Let the colour cross-fade in globals.css run, then get out of its way.
    document.documentElement.classList.add("theme-transition")
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 350)

    if (isLight) {
      setTheme("dark")
      document.documentElement.removeAttribute("data-theme")
      saveMode("dark")
    } else {
      setTheme("light")
      document.documentElement.setAttribute("data-theme", LIGHT_PALETTE)
      saveMode("light")
    }
  }

  const label = isLight ? "Switch to dark theme" : "Switch to light theme"

  return (
    <Tip label={label}>
      <button
        type="button"
        aria-label={label}
        onClick={toggle}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground md:size-10",
          "transition-colors duration-150 hover:bg-secondary",
          className,
        )}
      >
        {isLight ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
      </button>
    </Tip>
  )
}
