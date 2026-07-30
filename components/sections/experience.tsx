import { Award } from "lucide-react"
import { PopupLink } from "@/components/popup-link"
import { Reveal } from "@/components/motion/reveal"

interface Experience {
  title: string
  company: string
  period: string
  year: number
  location: string
  highlights: string[]
  type: "internship" | "research"
  certificate?: string
}

const experiences: Experience[] = [
  {
    title: "Software Development Intern",
    company: "Vertex Inc.",
    period: "June 2026 - Present",
    year: 2026,
    location: "Pennsylvania, US",
    type: "internship",
    highlights: [
      "Built a production-grade MCP platform that connects 105 enterprise tools via an Electron desktop app with 10 providers. It routes real requests across Jira, Slack, GitHub, Confluence, and more.",
      "Wrote 78 automated tests across unit, integration, functional, and e2e layers, reaching 92.65% coverage. The test suite catches regressions before they hit users.",
      "Instrumented every tool-discovery call to collect token usage data, then cut redundant context to achieve 36.11% improved token efficiency. Real cost savings on every request.",
    ],
  },
  {
    title: "aiX Convergence Design Studio Intern",
    company: "Columbia University",
    period: "Jan 2026 - Present",
    year: 2026,
    location: "New York, NY",
    type: "internship",
    highlights: [
      "Supporting a multi-year AI literacy initiative with Prof. Anthony Vanky, building tools that help students and educators work with AI in course design.",
      "Built a privacy-preserving image labeling platform with ensemble face detection (MTCNN + RetinaFace + MediaPipe) that automatically blurs PII before storage.",
      "Developing evaluation metrics for Data Science agents with Prof. Tian Zheng. The goal: measure whether an AI agent actually helps students learn, not just whether it answers correctly.",
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
    highlights: [
      "Built automated deployment scripts with CI/CD pipelines, reducing release time by 23%",
      "Designed data visualization dashboards for internal teams, cutting manual reporting by 8+ hours/week",
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
    highlights: [
      "Designed and built the Farmbot software platform, cutting API call time by 28% by restructuring how the frontend batched requests to SAP backend services.",
      "Integrated XSUAA authentication using JWT access tokens, locking down every endpoint in the service layer.",
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
    highlights: [
      "Developed a custom CNN framework for on-device document classification",
      "Co-authored and published a research paper at ISEC-2025",
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
    highlights: [
      "Developed key web assets including email landing pages and server status monitoring",
      "Contributed to the update and enhancement of the internship training syllabus",
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
          Six internships across three countries: enterprise AI at Vertex, research tooling at Columbia,
          Samsung R&D, SAP. Every bullet below shipped to real users or real benchmarks.
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

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="p-5 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="font-semibold">{experience.title}</h3>
        <span className="text-xs text-muted-foreground font-mono">{experience.period}</span>
      </div>
      <p className="text-sm text-primary mb-0.5">{experience.company}</p>
      <p className="text-xs text-muted-foreground mb-3">{experience.location}</p>
      <ul className="space-y-1.5">
        {experience.highlights.map((highlight, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            {highlight}
          </li>
        ))}
      </ul>
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
