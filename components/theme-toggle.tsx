"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  const toggle = () => {
    // Let the 1500ms color transition in globals.css run, then get out of its way.
    document.documentElement.classList.add("theme-transition")
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 1500)

    if (isDark) {
      setTheme("light")
      document.documentElement.setAttribute("data-theme", "light-extreme")
      localStorage.setItem("themeMode", "light")
    } else {
      setTheme("dark")
      document.documentElement.removeAttribute("data-theme")
      localStorage.setItem("themeMode", "dark")
    }
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn(
        "fixed top-4 right-4 z-40 inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background/80 backdrop-blur-sm px-3 text-sm shadow-xs",
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        className,
      )}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}
