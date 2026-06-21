import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArticlesSidebar } from "@/components/articles-sidebar"
import { MobileNewsDrawer } from "@/components/mobile-news-drawer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-heading", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

export const metadata: Metadata = {
  title: "Kartik Gounder | Software Engineer",
  description:
    "Software engineer & ML researcher at Columbia. Building production systems, AI platforms, and developer tools.",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
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
          <MobileNewsDrawer />
          {children}
          {/* Cmd+K hint */}
          <div className="fixed bottom-4 right-[340px] hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-sm">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-secondary rounded border border-border">Ctrl+K</kbd>
            <span>to search</span>
          </div>
        </ThemeProvider>
        <Analytics />
        {/* Console easter egg */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log(
                "%c" +
                "\\n" +
                "  _  __          _   _ _    \\n" +
                " | |/ /__ _ _ __| |_(_) | __\\n" +
                " | ' // _\` | '__| __| | |/ /\\n" +
                " | . \\\\ (_| | |  | |_| |   < \\n" +
                " |_|\\\\_\\\\__,_|_|   \\\\__|_|_|\\\\_\\\\\\n" +
                "\\n",
                "color: #10b981; font-family: monospace; font-size: 12px;"
              );
              console.log(
                "%cHey! Curious about the source? Check it out: https://github.com/KartikDaGreat/kartikgounder-website",
                "color: #6b7280; font-size: 13px;"
              );
              console.log(
                "%cAlso try: GET /api/resume for a machine-readable resume, or /llms.txt for AI context.",
                "color: #6b7280; font-size: 12px;"
              );
            `,
          }}
        />
      </body>
    </html>
  )
}
