"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const proceedLight = () => {
    setShowCountdown(false)
    // Enable smooth transition
    document.documentElement.classList.add("theme-transition")
    setTheme("light")
    document.documentElement.setAttribute("data-theme", "light-extreme")
    localStorage.setItem("themeMode", "light")
    // Remove transition class after animation completes
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 1500)
  }

  const cancelLight = () => {
    setShowCountdown(false)
    // Clear any running timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setCountdown(3)
  }

  const startCountdown = () => {
    setShowCountdown(true)
    setCountdown(3)
    // Clear any previous timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    // Begin countdown
    timerRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          // Finish and proceed
          if (timerRef.current) {
            window.clearInterval(timerRef.current)
            timerRef.current = null
          }
          // Slight delay to show flash effect
          setTimeout(() => proceedLight(), 100)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (!showCountdown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelLight()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showCountdown])

  if (!mounted) {
    return null
  }

  const toggle = () => {
    if (isDark) {
      // Show 3s countdown before switching to light mode
      startCountdown()
    } else {
      // Switch to dark mode immediately
      setTheme("dark")
      document.documentElement.removeAttribute("data-theme")
      localStorage.setItem("themeMode", "dark")
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
        className={cn(
          "fixed top-4 right-4 md:right-[21rem] z-40 inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-xs",
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

      {showCountdown && (
        <div className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm flex items-center justify-center">
          <div className="absolute inset-0 animate-pulse bg-primary/10" />
          <div className="relative z-10 w-full max-w-sm mx-auto rounded-xl border border-border bg-card p-6 text-center shadow-lg">
            <div className="text-xs font-mono text-muted-foreground mb-2">Switching to Light Mode in</div>
            <div className="text-6xl font-bold tracking-tight text-primary animate-pulse">
              {countdown}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Press Esc to cancel</div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={cancelLight}
                className="inline-flex h-9 items-center rounded-md border border-border bg-transparent px-3 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedLight}
                className="inline-flex h-9 items-center rounded-md border border-input bg-primary px-3 text-sm text-primary-foreground hover:opacity-90"
              >
                Switch now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
