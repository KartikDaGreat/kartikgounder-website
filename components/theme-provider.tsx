"use client"

import type * as React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

/**
 * Class-based light/dark for components that rely on next-themes (toasts and
 * other shadcn pieces that read the `dark` class). The palette itself is
 * picked before paint by the inline script in app/layout.tsx, and that script
 * never reads the OS preference, so neither does this: it defaults to dark,
 * matching every roulette palette, and only the theme toggle switches it.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemeProvider>
  )
}
