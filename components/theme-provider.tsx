"use client"

import type * as React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

/**
 * Class-based light/dark for components that rely on next-themes (the theme
 * toggle, toasts). The palette itself is picked before paint by the inline
 * script in app/layout.tsx, so nothing here needs to hide the page until
 * mount, and next-themes' own script is rendered on the server.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  )
}
