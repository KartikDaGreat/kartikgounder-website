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

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  const toggle = () => {
    if (isDark) {
      // Switch to light mode (extreme light palette)
      setTheme("light")
      document.documentElement.setAttribute("data-theme", "light-extreme")
      localStorage.setItem("themeMode", "light")
    } else {
      // Switch to dark mode
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
        "fixed top-4 right-4 z-50 inline-flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs",
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        className,
      )}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}
