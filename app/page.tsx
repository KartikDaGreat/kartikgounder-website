"use client"

import {
  useState,
  useRef,
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useCallback,
  startTransition,
  addTransitionType,
  ViewTransition,
} from "react"

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

// Landing beacon: logs the visit to the Sheet and pings the Pi's LED panel.
function collectAndSendVisitorInfo() {
  // Fire-and-forget: the route resolves location server-side and forwards it
  // to the Pi. Runs first and independently, since the Sheet block below
  // returns early when no sheet URL is configured.
  try {
    fetch("/api/greet", { method: "POST", keepalive: true });
  } catch { /* ignore errors */ }

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

// One loader per section, so the chunks can be preloaded once Home has
// painted. Section changes run in a transition, which waits for a chunk that
// hasn't arrived yet; preloading makes the switch (and its animation) instant.
const loaders = {
  home: () => import("@/components/sections/about").then((m) => ({ default: m.AboutSection })),
  work: () => import("@/components/sections/experience").then((m) => ({ default: m.ExperienceSection })),
  projects: () => import("@/components/sections/projects").then((m) => ({ default: m.ProjectsSection })),
  research: () => import("@/components/sections/research").then((m) => ({ default: m.ResearchSection })),
  education: () => import("@/components/sections/academics").then((m) => ({ default: m.AcademicsSection })),
  contact: () => import("@/components/sections/contact").then((m) => ({ default: m.ContactSection })),
  terminal: () => import("@/components/sections/terminal").then((m) => ({ default: m.TerminalSection })),
  lab: () => import("@/components/sections/systems").then((m) => ({ default: m.SystemsSection })),
  setup: () => import("@/components/sections/uses").then((m) => ({ default: m.UsesSection })),
}

const AboutSection = lazy(loaders.home)
const ExperienceSection = lazy(loaders.work)
const ProjectsSection = lazy(loaders.projects)
const ResearchSection = lazy(loaders.research)
const AcademicsSection = lazy(loaders.education)
const ContactSection = lazy(loaders.contact)
const TerminalSection = lazy(loaders.terminal)
const SystemsSection = lazy(loaders.lab)
const UsesSection = lazy(loaders.setup)

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
  // Always start at "home" so server and client render the same tree; the
  // hash-sync effect below corrects to the URL's section right after mount.
  // Reading window.location.hash in the initializer caused hydration errors.
  const [activeSection, setActiveSection] = useState<SectionId>("home")
  const activeRef = useRef<SectionId>("home")
  const mainRef = useRef<HTMLDivElement>(null)

  /**
   * Every section change goes through here. Animated changes run in a
   * transition tagged with the direction of travel through the sidebar order,
   * which the section's <ViewTransition> below turns into a slide.
   */
  const goTo = useCallback((next: SectionId, animate = true) => {
    const prev = activeRef.current
    if (next === prev) return
    activeRef.current = next
    if (!animate) {
      setActiveSection(next)
      return
    }
    startTransition(() => {
      addTransitionType(sectionOrder.indexOf(next) > sectionOrder.indexOf(prev) ? "section-down" : "section-up")
      setActiveSection(next)
    })
  }, [])

  // Scroll to the top once the new section has committed, inside the view
  // transition's update, so the outgoing snapshot keeps its scroll position.
  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" })
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [activeSection])

  const handleNavigate = useCallback(
    (section: SectionId) => {
      goTo(section)
      trackPageView(section)
      // pushState (not replaceState) so browser back steps through sections
      // instead of leaving the site.
      if (window.location.hash !== `#${section}`) {
        window.history.pushState(null, "", `#${section}`)
      }
    },
    [goTo],
  )

  // Arriving with a hash (a bookmark, or back from a project page) settles on
  // that section before paint, with no animation and no flash of Home.
  useLayoutEffect(() => {
    const section = resolveSection(window.location.hash.replace("#", ""))
    if (section) goTo(section, false)
  }, [goTo])

  // hashchange covers plain <a href="#..."> clicks and back/forward between
  // sections (every entry differs by its fragment, so traversal fires it too).
  // Deliberately not popstate: React finishes a transition started inside a
  // popstate event synchronously (for scroll restoration), so a section that
  // suspends would flash its skeleton and skip the view transition.
  useEffect(() => {
    function syncFromHash() {
      const section = resolveSection(window.location.hash.replace("#", "")) ?? "home"
      goTo(section)
    }
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [goTo])

  // Preload every section once the first screen is idle.
  useEffect(() => {
    const preload = () => Object.values(loaders).forEach((load) => load().catch(() => {}))
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preload, 1200)
    return () => clearTimeout(id)
  }, [])

  // Keyboard navigation: j/k for next/prev, 1-9 for direct jump
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
        const idx = sectionOrder.indexOf(activeRef.current)
        const next =
          e.key === "j" ? sectionOrder[Math.min(idx + 1, sectionOrder.length - 1)] : sectionOrder[Math.max(idx - 1, 0)]
        handleNavigate(next)
      } else {
        const num = parseInt(e.key)
        if (num >= 1 && num <= sectionOrder.length) {
          e.preventDefault()
          handleNavigate(sectionOrder[num - 1])
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
    <div className="min-h-dvh flex">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      <CommandPalette onNavigate={handleNavigate} />
      <KeyboardShortcuts />
      {/*
        min-w-0 is load-bearing: a flex item defaults to min-width:auto, so any
        single wide descendant (a long commit message, a code block) stretches
        main past the viewport and scrolls the whole page sideways on a phone.
      */}
      <main ref={mainRef} className="flex-1 min-w-0 ml-0 md:ml-24 lg:ml-72 transition-all duration-300">
        <div className="min-h-dvh p-5 pt-20 sm:p-6 md:p-12 md:pt-12 lg:p-16 lg:pl-24 max-w-5xl mx-auto">
          <Suspense fallback={<SectionLoader />}>
            {/*
              Keyed by section, so a change exits the old one and enters the
              new one. Only typed transitions animate: section changes slide
              in the direction of travel, and returning from a project page
              fades in. The first load and Suspense reveals stay still; the
              Home intro owns that moment.
            */}
            <ViewTransition
              key={activeSection}
              enter={{ "section-down": "section-down", "section-up": "section-up", "nav-back": "page-in", default: "none" }}
              exit={{ "section-down": "section-down", "section-up": "section-up", default: "none" }}
              default="none"
            >
              {renderSection()}
            </ViewTransition>
          </Suspense>
        </div>
      </main>
    </div>
  )
}
