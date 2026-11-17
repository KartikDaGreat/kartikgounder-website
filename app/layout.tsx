import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeDice } from "@/components/theme-dice"
import { MotionRoot } from "@/components/motion/motion-root"
import { basics, degrees, now, SITE_URL as PROFILE_URL } from "@/lib/profile"
import { paletteScript } from "@/lib/themes"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

const SITE_URL = "https://kartikgounder.com"
const DESCRIPTION =
  "Software engineer and MS CS student at Columbia. I build systems that have to survive contact with production: AI agent infrastructure, trust scoring for LLM-generated code, and privacy-preserving ML platforms."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kartik Gounder | Software Engineer",
    template: "%s | Kartik Gounder",
  },
  description: DESCRIPTION,
  keywords: [
    "Kartik Gounder",
    "software engineer",
    "AI infrastructure",
    "MCP",
    "agent evaluation",
    "machine learning",
    "Columbia University",
  ],
  authors: [{ name: "Kartik Gounder", url: SITE_URL }],
  creator: "Kartik Gounder",
  alternates: {
    canonical: "/",
    // For agents: a markdown index of the whole site, and the same data as JSON.
    types: { "text/plain": "/llms.txt", "application/json": "/api/agent" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Kartik Gounder",
    title: "Kartik Gounder | Software Engineer",
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/art/og-texture.png",
        width: 1200,
        height: 630,
        alt: "Line illustration of a workbench with tools, circuits, and code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Gounder | Software Engineer",
    description: DESCRIPTION,
    images: ["/art/og-texture.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
}

// The palette script picks dark or light before paint; let the browser match
// form controls and scrollbars to either.
export const viewport: Viewport = { colorScheme: "dark light" }

// Structured data so search engines and agents can read the basics without
// running the client-rendered page.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: basics.name,
  url: PROFILE_URL,
  email: `mailto:${basics.email}`,
  description: basics.summary,
  jobTitle: now[0]?.role,
  worksFor: now.map((n) => ({ "@type": "Organization", name: n.org.split(",")[0] })),
  alumniOf: degrees.map((d) => ({ "@type": "CollegeOrUniversity", name: d.school })),
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  sameAs: [basics.github, basics.linkedin],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Reveal wrappers server-render at opacity:0 and are animated in by JS.
          Without JS that content would never appear, so force it visible.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Picks the color palette before first paint, so it never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: paletteScript() }} />
        {/*
          The Home intro plays once per visit, and only when a visit lands on
          Home. Runs before paint so a returning visitor never sees it start.
          Add ?intro to the URL to replay it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,h=location.hash.slice(1);if(/[?&]intro(=|&|$)/.test(location.search))sessionStorage.removeItem("intro-seen");else if(sessionStorage.getItem("intro-seen")||location.pathname!=="/"||(h&&h!=="home"&&h!=="about"))d.dataset.introSeen="1"}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-secondary"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <MotionRoot>
            <div className="fixed top-0 right-0 z-30 flex h-14 items-center gap-1 px-2 md:top-4 md:right-4 md:h-auto md:gap-2 md:px-0">
              <ThemeDice />
              <ThemeToggle />
            </div>
            {children}
          </MotionRoot>
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
