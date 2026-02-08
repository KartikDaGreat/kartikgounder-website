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
  },{
  date: "2026-01-15",
  title: "Boston Scientific to Acquire Penumbra in ~$14.5B Medtech Deal",
  source: "MarketMinute",
  url: "https://markets.chroniclejournal.com/chroniclejournal/article/marketminute-2026-2-2-boston-scientifics-145-billion-stroke-of-genius-consolidation-heats-up-in-the-medtech-arms-race",
  description: "Boston Scientific announced the acquisition of thrombectomy and neurovascular leader Penumbra, marking major consolidation in medtech device space.", 
},
{
  date: "2026-01-22",
  title: "FDA Clears LIBERTY Endovascular Robotic System",
  source: "Today’s Medical Developments",
  url: "https://www.todaysmedicaldevelopments.com/article/regulatory-news-insights-january-february-2026/",
  description: "Microbot Medical’s remote endovascular robotic platform received FDA 510(k) clearance, promising efficiency gains and reduced clinician radiation exposure.",
},
{
  date: "2026-01-28",
  title: "Senseonics to Participate at BTIG MedTech Conference",
  source: "Seeking Alpha",
  url: "https://seekingalpha.com/pr/20379947-senseonics-holdings-inc-to-participate-at-the-btig-13th-annual-medtech-digital-health-life",
  description: "Senseonics, maker of long-term implantable glucose monitors, announced participation in a key MedTech, Digital Health & Life Sciences conference.", 
},
{
  date: "2026-01-30",
  title: "MD&M West 2026 Preview Highlights Industry Innovation",
  source: "Med-Tech Insights",
  url: "https://med-techinsights.com/2026/01/30/mdm-west-preview/",
  description: "Preview of MD&M West 2026 showcases new manufacturing, design, and connected device technologies in medical device engineering.",
},
{
  date: "2026-02-02",
  title: "Robotic Surgery Trends to Watch in 2026",
  source: "MedTech Dive",
  url: "https://www.medtechdive.com/news/5-robotic-surgery-trends-to-watch-2026/810577/",
  description: "Trend analysis on soft tissue robotic systems and expansion of surgical robotics into new clinical specialties.",
},
{
  date: "2026-02-02",
  title: "Stryker Raises 2026 Profit Forecast on MedTech Strength",
  source: "Reuters",
  url: "https://www.reuters.com/business/healthcare-pharmaceuticals/stryker-raises-annual-profit-forecast-strong-sales-medical-devices-2026-01-29/",
  description: "Stryker boosted its full-year profit outlook, driven by strong medtech device sales in implants and neurotechnology.",
},
{
  date: "2026-02-06",
  title: "MedTech Trends Shaping 2026",
  source: "IQVIA",
  url: "https://www.iqvia.com/blogs/2026/02/medtech-trends-shaping-2026",
  description: "Explores top medtech trends for 2026 including AI, real-world evidence, diagnostics, robotics, and digital health shaping the future of medical technology.",
},
{
  date: "2026-02-05",
  title: "Medtech Funding Challenges Discussed at MD&M West Keynote",
  source: "Design News",
  url: "https://www.designnews.com/medical/medtech-funding-challenges-discussed-at-mdm-west-keynote",
  description: "Key insights from MD&M West highlight funding pressures on medtech startups as strategic buyers focus on later-stage products amid industry consolidation.",
},
{
  date: "2026-02-02",
  title: "Beta Bionics Receives FDA Warning Letter",
  source: "MedTech Dive",
  url: "https://www.medtechdive.com/news/beta-bionics-receives-fda-warning-letter/811140/",
  description: "Beta Bionics announced an FDA warning letter related to its operations — noted not to affect current marketing, manufacturing, or distribution of its products.",
},
{
  date: "2026-02-02",
  title: "Affluent Medical Officially Becomes CARVOLIX",
  source: "TradingView News",
  url: "https://www.tradingview.com/news/eqs%3A595eada36094b%3A0-affluent-medical-officially-becomes-carvolix/",
  description: "Medtech company Affluent Medical completed a rebrand and corporate evolution, officially taking on the name CARVOLIX.",
},
{
  date: "2026-02-08",
  title: "India-US Trade Framework Expected to Deepen Pharma and Medtech Collaboration",
  source: "Times of India",
  url: "https://timesofindia.indiatimes.com/business/india-business/india-us-trade-framework-expected-to-deepen-pharma-and-medtech-collaboration-says-ipa/articleshow/128042417.cms",
  description: "News on India–US interim trade agreement expected to enhance collaboration in pharmaceuticals and medtech, strengthening innovation and supply chains between the two nations.",
},
{
  date: "2026-02-06",
  title: "Paperclip-Sized Heart Sensor to Help NHS Patients with Chronic Heart Failure",
  source: "The Sun",
  url: "https://www.thesun.co.uk/health/38127862/brits-deadly-heart-issues-get-nhs-implant/",
  description: "A tiny wireless implantable sensor (CardioMEMS HF System) is being rolled out on the NHS to remotely monitor heart failure symptoms, reducing hospital admissions.",
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
      className="fixed top-0 right-0 h-screen w-80 bg-background border-l shadow-lg z-40 flex flex-col hidden lg:flex md:hidden"
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
