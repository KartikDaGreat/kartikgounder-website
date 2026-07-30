"use client"

import { useState, useRef, lazy, Suspense, useEffect, useCallback } from "react"

// Generate or retrieve a unique visitor ID for this session
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("visitorId", id);
  }
  return id;
}

// Track a page/section view
function trackPageView(section: string) {
  try {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!sheetUrl) return;
    const formData = new URLSearchParams();
    formData.append("Visitor ID", getVisitorId());
    formData.append("Section", section);
    formData.append("Timestamp", new Date().toISOString());
    formData.append("Source", "nav_click");
    fetch(sheetUrl, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    });
  } catch { /* ignore errors */ }
}

// Privacy-respecting visitor info: anonymous visit count only
function collectAndSendVisitorInfo() {
  try {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!sheetUrl) return;
    const formData = new URLSearchParams();
    formData.append("Visitor ID", getVisitorId());
    formData.append("Timestamp", new Date().toLocaleString());
    formData.append("Section", "landing");
    fetch(sheetUrl, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    });
  } catch { /* ignore errors */ }
}
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"

const AboutSection = lazy(() => import("@/components/sections/about").then((m) => ({ default: m.AboutSection })))
const AcademicsSection = lazy(() =>
  import("@/components/sections/academics").then((m) => ({ default: m.AcademicsSection })),
)
const ResearchSection = lazy(() =>
  import("@/components/sections/research").then((m) => ({ default: m.ResearchSection })),
)
const ExperienceSection = lazy(() =>
  import("@/components/sections/experience").then((m) => ({ default: m.ExperienceSection })),
)
const ContactSection = lazy(() => import("@/components/sections/contact").then((m) => ({ default: m.ContactSection })))
const TerminalSection = lazy(() =>
  import("@/components/sections/terminal").then((m) => ({ default: m.TerminalSection })),
)
const SystemsSection = lazy(() =>
  import("@/components/sections/systems").then((m) => ({ default: m.SystemsSection })),
)
const UsesSection = lazy(() =>
  import("@/components/sections/uses").then((m) => ({ default: m.UsesSection })),
)
const ProjectsSection = lazy(() =>
  import("@/components/sections/projects").then((m) => ({ default: m.ProjectsSection })),
)
export type SectionId =
  | "home"
  | "work"
  | "projects"
  | "research"
  | "education"
  | "contact"
  | "terminal"
  | "lab"
  | "setup"

const sectionOrder: SectionId[] = ["home", "work", "projects", "research", "education", "contact", "terminal", "lab", "setup"]

// Old section ids still resolve so existing links, bookmarks, and terminal
// commands keep working after the IA rename.
export const SECTION_ALIASES: Record<string, SectionId> = {
  about: "home",
  experience: "work",
  academics: "education",
  systems: "lab",
  uses: "setup",
}

function resolveSection(raw: string): SectionId | null {
  if (sectionOrder.includes(raw as SectionId)) return raw as SectionId
  return SECTION_ALIASES[raw] ?? null
}

function SectionLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-48 bg-secondary rounded mb-4" />
      <div className="h-4 w-full bg-secondary rounded mb-2" />
      <div className="h-4 w-3/4 bg-secondary rounded mb-2" />
      <div className="h-4 w-1/2 bg-secondary rounded" />
    </div>
  )
}

export default function Home() {
    useEffect(() => {
      // Use sessionStorage to persist across reloads and hydration quirks
      if (typeof window !== "undefined" && !sessionStorage.getItem("visitorInfoSent")) {
        collectAndSendVisitorInfo();
        trackPageView("home"); // Track initial landing page
        sessionStorage.setItem("visitorInfoSent", "1");
        // Count visit for systems dashboard
        fetch("/api/visitors/count", { method: "POST" }).catch(() => {});
      }
    }, []);
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    if (typeof window !== "undefined") {
      const section = resolveSection(window.location.hash.replace("#", ""))
      if (section) return section
    }
    return "home"
  })
  const mainRef = useRef<HTMLDivElement>(null)

  const handleNavigate = useCallback((section: SectionId) => {
    setActiveSection(section)
    trackPageView(section)
    // replaceState avoids re-triggering hashchange while keeping URLs shareable
    window.history.replaceState(null, "", `#${section}`)
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" })
    }
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  // Listen for hash changes (e.g. back button from project pages)
  useEffect(() => {
    function onHashChange() {
      const section = resolveSection(window.location.hash.replace("#", ""))
      if (section) {
        setActiveSection(section)
        if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "instant" })
        window.scrollTo({ top: 0, behavior: "instant" })
      }
    }
    window.addEventListener("hashchange", onHashChange)
    // Also check on mount in case we arrived with a hash
    onHashChange()
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  // Keyboard navigation: j/k for next/prev, 1-8 for direct jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea or command palette is open
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.metaKey || e.ctrlKey)
      ) {
        return
      }

      if (e.key === "j" || e.key === "k") {
        e.preventDefault()
        setActiveSection((prev) => {
          const idx = sectionOrder.indexOf(prev)
          const next =
            e.key === "j"
              ? sectionOrder[Math.min(idx + 1, sectionOrder.length - 1)]
              : sectionOrder[Math.max(idx - 1, 0)]
          if (next !== prev) {
            trackPageView(next)
            window.history.replaceState(null, "", `#${next}`)
          }
          return next
        })
        if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "instant" })
        window.scrollTo({ top: 0, behavior: "instant" })
      } else {
        // Number keys 1-9 for direct section jump
        const num = parseInt(e.key)
        if (num >= 1 && num <= sectionOrder.length) {
          e.preventDefault()
          const section = sectionOrder[num - 1]
          handleNavigate(section)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNavigate])

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <AboutSection />
      case "work":
        return <ExperienceSection />
      case "projects":
        return <ProjectsSection />
      case "research":
        return <ResearchSection />
      case "education":
        return <AcademicsSection />
      case "contact":
        return <ContactSection />
      case "terminal":
        return <TerminalSection />
      case "lab":
        return <SystemsSection />
      case "setup":
        return <UsesSection />
      default:
        return <AboutSection />
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      <CommandPalette onNavigate={handleNavigate} />
      <KeyboardShortcuts />
      <main ref={mainRef} className="flex-1 ml-0 md:ml-24 lg:ml-72 transition-all duration-300">
        <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-12 lg:p-16 lg:pl-24 max-w-5xl mx-auto">
          <Suspense fallback={<SectionLoader />}>{renderSection()}</Suspense>
        </div>
      </main>
    </div>
  )
}
