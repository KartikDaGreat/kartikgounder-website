"use client"

import type * as React from "react"
import { useEffect, useState } from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

const SUNRISE_THEMES = [
  "sunrise-peach",
  "sunrise-gold",
  "sunrise-coral",
  "sunrise-amber",
  "sunrise-blush",
  "sunrise-honey",
  "sunrise-apricot",
  "sunrise-mango",
  "sunrise-champagne",
  "sunrise-saffron",
  "sunrise-tangerine",
  "sunrise-dawn",
] as const

const DAYLIGHT_THEMES = [
  "daylight-sky",
  "daylight-mint",
  "daylight-cloud",
  "daylight-aqua",
  "daylight-sage",
  "daylight-azure",
  "daylight-seafoam",
  "daylight-breeze",
  "daylight-teal",
  "daylight-cyan",
  "daylight-lagoon",
  "daylight-crystal",
] as const

const SUNSET_THEMES = [
  "sunset-coral",
  "sunset-rose",
  "sunset-tangerine",
  "sunset-crimson",
  "sunset-magenta",
  "sunset-ember",
  "sunset-plum",
  "sunset-wine",
  "sunset-burgundy",
  "sunset-cherry",
  "sunset-copper",
  "sunset-dusk",
] as const

const MIDNIGHT_THEMES = [
  "midnight-indigo",
  "midnight-navy",
  "midnight-plum",
  "midnight-void",
  "midnight-obsidian",
  "midnight-cosmos",
  "midnight-abyss",
  "midnight-eclipse",
  "midnight-onyx",
  "midnight-charcoal",
  "midnight-shadow",
  "midnight-storm",
] as const

const BASE_THEMES = ["default", "warm", "ocean", "mono", "forest"] as const

interface ThemeProviderProps {
  children: React.ReactNode
}

function getRandomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getTimeBasedTheme(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 9) return getRandomFromArray(SUNRISE_THEMES)
  if (hour >= 9 && hour < 17) return getRandomFromArray(DAYLIGHT_THEMES)
  if (hour >= 17 && hour < 20) return getRandomFromArray(SUNSET_THEMES)
  return getRandomFromArray(MIDNIGHT_THEMES)
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Respect saved user preference first
    const savedMode = typeof window !== "undefined" ? localStorage.getItem("themeMode") : null
    if (savedMode === "light") {
      document.documentElement.setAttribute("data-theme", "light-extreme")
    } else if (savedMode === "dark") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      // No saved preference: pick a time-based or base theme
      const useTimeBasedTheme = Math.random() < 0.7
      const selectedTheme = useTimeBasedTheme ? getTimeBasedTheme() : getRandomFromArray(BASE_THEMES)
      if (selectedTheme !== "default") {
        document.documentElement.setAttribute("data-theme", selectedTheme)
      } else {
        document.documentElement.removeAttribute("data-theme")
      }
    }

    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  // Provide class-based light/dark for components that rely on next-themes
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  )
}
