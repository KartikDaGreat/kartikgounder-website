"use client"

import { useState, useRef, lazy, Suspense, useEffect } from "react"

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
    formData.append("type", "pageview");
    formData.append("Visitor ID", getVisitorId());
    formData.append("Section", section);
    formData.append("Timestamp", new Date().toISOString());
    formData.append("Source", "nav_click");
    fetch(sheetUrl, { method: "POST", body: formData });
  } catch { /* ignore errors */ }
}

// Visitor info collection and reporting
function collectAndSendVisitorInfo() {
  try {
    // Network & Location (IP/location via ipapi.co)
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(ipData => {
        // Device & Display
        const screenSize = `${window.screen.width}x${window.screen.height}`;
        const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
        // Browser & Language
        const browser = (() => {
          const ua = navigator.userAgent;
          if (ua.includes("Chrome")) return "Chrome";
          if (ua.includes("Firefox")) return "Firefox";
          if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
          if (ua.includes("Edge")) return "Edge";
          return "Other";
        })();
        // Privacy
        const cookiesEnabled = navigator.cookieEnabled ? "true" : "false";
        const localStorageEnabled = (() => {
          try { localStorage.setItem("_test", "1"); localStorage.removeItem("_test"); return "true"; } catch { return "false"; }
        })();
        // Connection
        const nav = navigator;
        const connection = (nav as any).connection || (nav as any).mozConnection || (nav as any).webkitConnection;
        // Compose payload
        const payload = {
          "IP Address": ipData.ip || "",
          "Location": ipData.city && ipData.region && ipData.country_name ? `${ipData.city}, ${ipData.region}, ${ipData.country_name}` : "",
          "Coordinates": ipData.latitude && ipData.longitude ? `${ipData.latitude},${ipData.longitude}` : "",
          "Postal Code": ipData.postal || "",
          "Country Code": ipData.country_code || "",
          "ISP": ipData.org || ipData.org_name || "",
          "Organization": ipData.org || ipData.org_name || "",
          "ASN": ipData.asn || "",
          "Platform": nav.platform || "",
          "Screen Size": screenSize,
          "Viewport Size": viewportSize,
          "Color Depth": window.screen.colorDepth ? String(window.screen.colorDepth) : "",
          "Browser": browser,
          "User Agent": nav.userAgent || "",
          "Language": nav.language || "",
          "Accepted Encoding": (nav as any).acceptEncoding || "",
          "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          "Device Memory": (nav as any).deviceMemory ? String((nav as any).deviceMemory) : "",
          "Connection Type": connection && connection.effectiveType ? connection.effectiveType : "",
          "Do Not Track": nav.doNotTrack || "",
          "Cookies Enabled": cookiesEnabled,
          "LocalStorage": localStorageEnabled,
          "Timestamp": new Date().toLocaleString()
        };
        // Convert payload to form data
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, value ?? "");
        });
        const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
        if (sheetUrl) {
          fetch(sheetUrl, {
            method: "POST",
            body: formData
          });
        }
      });
  } catch (e) { /* ignore errors */ }
}
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
    useEffect(() => {
      // Use sessionStorage to persist across reloads and hydration quirks
      if (typeof window !== "undefined" && !sessionStorage.getItem("visitorInfoSent")) {
        collectAndSendVisitorInfo();
        trackPageView("about"); // Track initial landing page
        sessionStorage.setItem("visitorInfoSent", "1");
      }
    }, []);
  const [activeSection, setActiveSection] = useState<SectionId>("about")
  const mainRef = useRef<HTMLDivElement>(null)

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section)
    trackPageView(section)
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
      <main ref={mainRef} className="flex-1 ml-0 md:ml-24 lg:ml-72 lg:mr-80 transition-all duration-300">
        <div className="min-h-screen p-6 pt-16 md:p-12 md:pt-12 lg:p-16 lg:pl-24 max-w-4xl mx-auto">
          <Suspense fallback={<SectionLoader />}>{renderSection()}</Suspense>
        </div>
      </main>
    </div>
  )
}
