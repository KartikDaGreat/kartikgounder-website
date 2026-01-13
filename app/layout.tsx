import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArticlesSidebar } from "@/components/articles-sidebar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-heading", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

export const metadata: Metadata = {
  title: "Kartik | CS Researcher & Developer",
  description:
    "Personal portfolio of Kartik - Computer Science researcher, software engineer, and machine learning enthusiast",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${workSans.variable} ${jetbrainsMono.variable} font-sans antialiased text-[17px] md:text-[18px] leading-7 md:leading-8`}
      >
        <ThemeProvider>
          <ThemeToggle />
          <ArticlesSidebar />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
