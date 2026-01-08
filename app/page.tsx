"use client"

import { useState, useRef, lazy, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"

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

export type SectionId = "about" | "academics" | "research" | "experience" | "contact" | "terminal"

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
  const [activeSection, setActiveSection] = useState<SectionId>("about")
  const mainRef = useRef<HTMLDivElement>(null)

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section)
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" })
    }
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  const renderSection = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection />
      case "academics":
        return <AcademicsSection />
      case "research":
        return <ResearchSection />
      case "experience":
        return <ExperienceSection />
      case "contact":
        return <ContactSection />
      case "terminal":
        return <TerminalSection />
      default:
        return <AboutSection />
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      <main ref={mainRef} className="flex-1 ml-0 md:ml-24 lg:ml-72 transition-all duration-300">
        <div className="min-h-screen p-6 md:p-12 lg:p-16 lg:pl-24 max-w-4xl mx-auto">
          <Suspense fallback={<SectionLoader />}>{renderSection()}</Suspense>
        </div>
      </main>
    </div>
  )
}
