import { Award } from "lucide-react"
import { PopupLink } from "@/components/popup-link"
import { Reveal } from "@/components/motion/reveal"
import { MetricChips } from "@/components/metric-chips"
import { Expander } from "@/components/expander"

interface Highlight {
  lead: string
  text: string
}

interface Experience {
  title: string
  company: string
  period: string
  year: number
  location: string
  metrics?: string[]
  highlights: Highlight[]
  type: "internship" | "research"
  certificate?: string
}

/** Bullets shown before the "+n more" fold kicks in. */
const VISIBLE_HIGHLIGHTS = 2

const experiences: Experience[] = [
  {
    title: "Software Development Intern",
    company: "Vertex Inc.",
    period: "June 2026 - Present",
    year: 2026,
    location: "Pennsylvania, US",
    type: "internship",
    metrics: ["2-2.5h saved per bug", "36.11% fewer tokens per request"],
    highlights: [
      {
        lead: "MCP platform",
        text: "connects 105 enterprise tools through one Electron app, routing real requests across Jira, Slack, GitHub, Confluence, and more.",
      },
      {
        lead: "Sherlock",
        text: "AI bug tracer that validates issues against Datadog logs and Pulsar events with chain-of-thought reasoning. Cuts 2 to 2.5 hours off every debugging cycle.",
      },
      {
        lead: "78 tests",
        text: "across unit, integration, functional, and e2e layers, at 92.65% coverage.",
      },
      {
        lead: "Token instrumentation",
        text: "measured every tool-discovery call, then cut redundant context for a 36.11% saving.",
      },
    ],
  },
  {
    title: "aiX Convergence Design Studio Intern",
    company: "Columbia University",
    period: "Jan 2026 - Present",
    year: 2026,
    location: "New York, NY",
    type: "internship",
    metrics: ["PII blurred before storage", "agent evaluation metrics"],
    highlights: [
      {
        lead: "Privacy pipeline",
        text: "image labeling platform with ensemble face detection (MTCNN + RetinaFace + MediaPipe) that blurs PII before anything hits storage.",
      },
      {
        lead: "Agent evaluation",
        text: "metrics with Prof. Tian Zheng for whether a data-science agent actually helps students learn, not just whether it answers correctly.",
      },
      {
        lead: "AI literacy",
        text: "multi-year initiative with Prof. Anthony Vanky, building tools for students and educators working with AI in course design.",
      },
    ],
    certificate: "https://drive.google.com/file/d/1XNSc5r4Z2FpBkPpxfL4F7uuOdVi5_0Mb/view?usp=sharing",
  },
  {
    title: "Software Development Intern",
    company: "eNova Software and Hardware Solutions",
    period: "January 2025 - June 2025",
    year: 2025,
    location: "Coimbatore, Tamil Nadu, India",
    type: "internship",
    metrics: ["45 to 35 min releases", "13% revenue lift", "19% fewer threats"],
    highlights: [
      {
        lead: "CI/CD",
        text: "parallelized the testing and security checks, taking a production release from about 45 minutes down to 35.",
      },
      {
        lead: "3 AI modules",
        text: "scaled up across the Python products, working with 15 clients to predictively improve revenue by 13%.",
      },
      {
        lead: "Security scanner",
        text: "redesigned around local server-based agentic monitoring, cutting threats that reached a release by 19%.",
      },
    ],
    certificate: "https://drive.google.com/file/d/1kL7yFm7ALNFfT2R6YdrNCYVFRnZWNI_z/view?usp=sharing",
  },
  {
    title: "iXp Intern",
    company: "SAP Labs India",
    period: "June 2024 - August 2024",
    year: 2024,
    location: "Bangalore, India",
    type: "internship",
    metrics: ["28% faster API calls", "JWT auth on every endpoint"],
    highlights: [
      { lead: "Farmbot", text: "designed and built the platform, cutting API call time 28% by restructuring frontend request batching." },
      { lead: "XSUAA auth", text: "JWT access tokens locking down every endpoint in the service layer." },
    ],
    certificate: "https://drive.google.com/file/d/1P6tKBze3g_Ph-Tz2fRZoHEUmEasikRZn/view?usp=sharing",
  },
  {
    title: "R&D Intern (Samsung PRISM)",
    company: "Samsung R&D Institute India - Bangalore",
    period: "January 2024 - May 2024",
    year: 2024,
    location: "Bangalore, India",
    type: "internship",
    metrics: ["shipped on-device, no cloud", "published at ISEC-2025"],
    highlights: [
      { lead: "On-device CNN", text: "custom framework for document classification that runs on the phone, not a server." },
      { lead: "ISEC-2025", text: "co-authored and published the research paper behind it." },
    ],
    certificate: "https://drive.google.com/file/d/1xpLRjU5B9Chpf3GpxL4jeNGbhm4g0_5B/view?usp=sharing",
  },
  {
    title: "Software Engineer Intern",
    company: "eNova Software and Hardware Solutions",
    period: "August 2023 - December 2023",
    year: 2023,
    location: "Coimbatore, Tamil Nadu, India",
    type: "internship",
    metrics: ["shipped server monitoring", "rewrote the training syllabus"],
    highlights: [
      { lead: "Web assets", text: "email landing pages and server status monitoring." },
      { lead: "Training syllabus", text: "updated and enhanced the internship curriculum." },
    ],
    certificate: "https://drive.google.com/file/d/1kL7yFm7ALNFfT2R6YdrNCYVFRnZWNI_z/view?usp=sharing",
  },
]

const years = [...new Set(experiences.map((e) => e.year))].sort((a, b) => b - a)

export function ExperienceSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Building</h1>
        <p className="text-muted-foreground">
          Six internships, three countries. Every bullet below shipped to real users or real benchmarks.
        </p>
      </div>

      <div className="relative border-l-2 border-border ml-3 md:ml-6 space-y-10 pb-2">
        {years.map((year) => (
          <div key={year}>
            <div className="flex items-center gap-4 mb-5 -ml-[13px] md:-ml-[13px]">
              <span className="w-6 h-6 rounded-full bg-primary flex-shrink-0" aria-hidden />
              <span className="text-lg font-bold">{year}</span>
            </div>
            <div className="space-y-4 pl-6 md:pl-8">
              {experiences
                .filter((e) => e.year === year)
                .map((exp, i) => (
                  <Reveal key={i}>
                    <ExperienceCard experience={exp} />
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">Technical Skills</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-3">Languages & Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "Python", "Java", "C++", "React", "Next.js", "Flask", "Kotlin"].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">ML/AI & Data</h3>
            <div className="flex flex-wrap gap-2">
              {["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "LLMs", "MCP", "Ollama", "PostgreSQL"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">Infrastructure & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {["AWS", "Docker", "Electron", "CI/CD", "Vercel", "Firebase", "Git", "Jest"].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HighlightItem({ highlight }: { highlight: Highlight }) {
  return (
    <li className="text-sm text-muted-foreground flex items-start gap-2">
      <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
      <span>
        <span className="font-semibold text-foreground">{highlight.lead}</span>: {highlight.text}
      </span>
    </li>
  )
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const visible = experience.highlights.slice(0, VISIBLE_HIGHLIGHTS)
  const folded = experience.highlights.slice(VISIBLE_HIGHLIGHTS)

  return (
    <article className="p-5 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
        <h3 className="font-semibold">
          {experience.company} <span className="font-normal text-muted-foreground">· {experience.title}</span>
        </h3>
        <span className="text-xs text-muted-foreground font-mono">{experience.period}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{experience.location}</p>
      {experience.metrics && <MetricChips items={experience.metrics} className="mb-3" />}
      <ul className="space-y-1.5">
        {visible.map((highlight) => (
          <HighlightItem key={highlight.lead} highlight={highlight} />
        ))}
      </ul>
      {folded.length > 0 && (
        <Expander label={`+${folded.length} more`}>
          <ul className="space-y-1.5 mt-1.5">
            {folded.map((highlight) => (
              <HighlightItem key={highlight.lead} highlight={highlight} />
            ))}
          </ul>
        </Expander>
      )}
      {experience.certificate && (
        <div className="mt-3">
          <PopupLink
            href={experience.certificate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Award className="w-3 h-3" />
            Certificate
          </PopupLink>
        </div>
      )}
    </article>
  )
}
