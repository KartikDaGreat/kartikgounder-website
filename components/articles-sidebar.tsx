"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Article {
  date: string
  title: string
  source: string
  url: string
  description: string
}

const articles: Article[] = [
  {
    date: "2023-01-16",
    title: "10 Healthcare Technology Trends for 2023",
    source: "Philips",
    url: "https://www.philips.com/a-w/about/news/archive/features/2023/20230116-10-healthcare-technology-trends-for-2023.html",
    description: "AI automation, remote operations, sustainability in healthcare",
  },
  {
    date: "2024-03-15",
    title: "7 Tech Innovations Shaping Healthcare in 2024",
    source: "Shoolini University",
    url: "https://shooliniuniversity.com/blog/7-tech-innovations-shaping-healthcare-in-2024/",
    description: "Real-time monitoring, wearables, AI diagnostics, 3D printing, VR",
  },
  {
    date: "2024-10-15",
    title: "10 Healthcare Technology Trends for 2025",
    source: "Philips",
    url: "https://www.philips.com/a-w/about/news/archive/features/2024/10-healthcare-technology-trends-for-2025.html",
    description: "AI-enhanced diagnostics, simplified imaging, digital care tools",
  },
  {
    date: "2024-11-01",
    title: "Healthcare Technology Trends Reshaping Modern Medical Practice",
    source: "HealthTechZone",
    url: "https://www.healthtechzone.com/topics/healthcare/articles/2024/11/01/461109-healthcare-technology-trends-reshaping-modern-medical-practice.htm",
    description: "Cloud computing, predictive analytics, interoperability",
  },
  {
    date: "2025-07-15",
    title: "Cedars-Sinai AI Platform Expands Care Access",
    source: "Business Insider",
    url: "https://www.businessinsider.com/cedars-sinai-la-healthcare-organization-ai-platform-patient-care-treatment-2025-7",
    description: "AI platform: 24/7 service to 42K+ users, frees clinician time",
  },
  {
    date: "2025-08-30",
    title: "Doctors Develop an AI Stethoscope to Detect Heart Conditions",
    source: "The Guardian",
    url: "https://www.theguardian.com/technology/2025/aug/30/doctors-ai-stethoscope-heart-disease-london",
    description: "AI stethoscope diagnoses heart conditions in seconds",
  },
  {
    date: "2025-12-20",
    title: "Digital Drug Tracking System Launched by AIIMS Raipur",
    source: "Times of India",
    url: "https://timesofindia.indiatimes.com/city/raipur/aiims-r-launches-new-digital-drug-tracking-system/articleshow/126108930.cms",
    description: "Web-based drug tracking improves inventory & ED efficiency",
  },
  {
    date: "2026-01-08",
    title: "OpenAI Usage in Healthcare Hits 40M Daily Users",
    source: "TechRadar",
    url: "https://www.techradar.com/ai-platforms-assistants/openai/openai-says-40-million-people-use-chatgpt-for-healthcare-every-day",
    description: "40M daily users for health queries & symptom checking",
  },
  {
    date: "2026-01-09",
    title: "Innovative Health & Wellness Gadgets from CES 2026",
    source: "NY Post",
    url: "https://nypost.com/2026/01/09/health/the-6-coolest-health-and-wellness-gadgets-we-saw-at-ces/",
    description: "CES highlights: longevity scanners, advanced wearable sensors",
  },
  {
    date: "2026-01-10",
    title: "CES 2026 Spotlight on Metabolic and Fluid-Based Diagnostics",
    source: "The Verge",
    url: "https://www.theverge.com/tech/859132/optimizer-ces-2026-metabolism-bodily-fluids-health-tech-wearables",
    description: "Metabolic monitoring & smart fluid-based diagnostics",
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function ArticlesSidebar() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const resumeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // Use setInterval for reliable scrolling
    intervalRef.current = window.setInterval(() => {
      if (!isPausedRef.current && scrollContainer) {
        const currentScroll = scrollContainer.scrollTop
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight
        
        if (currentScroll >= maxScroll) {
          scrollContainer.scrollTop = 0
        } else {
          scrollContainer.scrollTop = currentScroll + 1
        }
      }
    }, 30) // Scroll every 30ms for smooth animation

    const handleUserInteraction = () => {
      isPausedRef.current = true
      
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
      
      resumeTimeoutRef.current = window.setTimeout(() => {
        isPausedRef.current = false
      }, 3000)
    }

    scrollContainer.addEventListener('wheel', handleUserInteraction, { passive: true })
    scrollContainer.addEventListener('touchstart', handleUserInteraction, { passive: true })

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
      scrollContainer.removeEventListener('wheel', handleUserInteraction)
      scrollContainer.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const handleMouseEnter = () => {
    isPausedRef.current = true
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    isPausedRef.current = false
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      className="fixed top-0 right-0 h-screen w-80 bg-background border-l shadow-lg z-40 flex flex-col hidden lg:flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b bg-background">
        <h3 className="text-lg font-semibold">📚 Interesting Articles</h3>
        <p className="text-xs text-muted-foreground">Healthcare tech insights</p>
      </div>
      
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <div className="p-4 space-y-3">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">{formatDate(article.date)}</span>
                  </div>
                  <h4 className="text-sm font-medium leading-tight mb-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1.5">{article.source}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 flex-shrink-0 opacity-70 group-hover:opacity-100"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
