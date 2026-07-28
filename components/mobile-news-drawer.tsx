"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Article {
  date: string
  title: string
  source: string
  url: string
  description: string
}

const articles: Article[] = [
  {
    date: "2026-07-15",
    title: "AI Wearable Cardiac Patch Achieves 99.6% Arrhythmia Detection Accuracy",
    source: "MarketScale",
    url: "https://www.marketscale.com/industries/healthcare/digital-healths-july-2026-signal-ai-wearables-a-new-cms-office-and-the-telehealth-billing-fight",
    description: "A new AI-powered cardiac patch detects life-threatening heart rhythm abnormalities with 99.6% accuracy.",
  },
  {
    date: "2026-07-10",
    title: "CMS Establishes New Office of Health Technology Products for AI Oversight",
    source: "Healthcare IT Today",
    url: "https://www.healthcareittoday.com/2026/07/25/weekly-roundup-july-25-2026/",
    description: "CMS created the OHTP to oversee AI, interoperability, and digital health tools across federal healthcare programs.",
  },
  {
    date: "2026-07-08",
    title: "HealthLynked Launches AI Agent Platform for Patient-Provider Communication",
    source: "Health IT Answers",
    url: "https://www.healthitanswers.net/ai-in-healthcare-news-and-updates-071526/",
    description: "Next-gen AI agent platform transforms how patients connect with providers. Agentic AI enters clinical workflows.",
  },
  {
    date: "2026-06-20",
    title: "Digital Health Startups Raise $4B in Q1 2026, Up $1B Year-over-Year",
    source: "Crescendo AI",
    url: "https://www.crescendo.ai/news/ai-in-healthcare-news",
    description: "VC funding for digital health surged to $4B in Q1 2026. Medical imaging leads clinical AI use cases at 61%.",
  },
  {
    date: "2026-06-15",
    title: "Clair Health Raises $11.6M for Hormone-Monitoring Wearable",
    source: "Building Better Healthcare",
    url: "https://www.buildingbetterhealthcare.com/health-tech-round-up-june-2026",
    description: "A wearable that monitors hormonal changes without blood draws, pairing 10 biosensors with AI voice biomarker analysis.",
  },
  {
    date: "2026-06-01",
    title: "Mayo Clinic Deploys AI to Predict Sepsis 6 Hours Earlier",
    source: "Healthcare IT News",
    url: "https://www.healthcareitnews.com/news/mayo-clinic-platform-uses-ai-detect-sepsis-early",
    description: "Mayo Clinic's ML model flags sepsis risk up to 6 hours before clinical onset. 20% reduction in mortality rates.",
  },
  {
    date: "2026-05-28",
    title: "AI Detects Brain Hemorrhages in Seconds Before Physicians Can See Them",
    source: "Philips",
    url: "https://www.philips.com/a-w/about/news/archive/features/2026/this-years-emerging-trends-in-healthcare-ai-so-far.html",
    description: "AI now detects life-threatening brain hemorrhages in seconds, flagging critical findings before physicians can identify them.",
  },
  {
    date: "2026-05-10",
    title: "AI Outperforms Radiologists in Breast Cancer Screening Study",
    source: "The Lancet",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(23)00298-X/fulltext",
    description: "AI-assisted mammography detects 20% more cancers while halving radiologist workload in routine screenings.",
  },
  {
    date: "2026-01-08",
    title: "OpenAI Usage in Healthcare Hits 40M Daily Users",
    source: "TechRadar",
    url: "https://www.techradar.com/ai-platforms-assistants/openai/openai-says-40-million-people-use-chatgpt-for-healthcare-every-day",
    description: "40M daily users for health queries and symptom checking.",
  },
  {
    date: "2025-08-30",
    title: "Doctors Develop an AI Stethoscope to Detect Heart Conditions",
    source: "The Guardian",
    url: "https://www.theguardian.com/technology/2025/aug/30/doctors-ai-stethoscope-heart-disease-london",
    description: "AI stethoscope diagnoses heart conditions in seconds.",
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function MobileNewsDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      {/* Bottom drawer trigger - mobile only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
          "bg-muted/90 backdrop-blur-sm border-t border-border",
          "px-4 py-3 flex items-center justify-between",
          "hover:bg-muted transition-colors"
        )}
      >
        <span className="text-sm font-semibold">Articles I found Interesting</span>
        <ChevronUp className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer content */}
      <div
        className={cn(
          "fixed bottom-12 left-0 right-0 z-40 lg:hidden",
          "bg-background border-t border-border shadow-lg",
          "overflow-y-auto transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[60vh]" : "max-h-0"
        )}
      >
        <div className="p-4 space-y-3">
          {articles.slice(0, 5).map((article, idx) => (
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
    </>
  )
}
