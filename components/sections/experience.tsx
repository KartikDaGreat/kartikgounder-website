import { Briefcase, Code2, ExternalLink, Award } from "lucide-react"
import Link from "next/link"
import { projects, type Project } from "@/lib/projects"
import { PopupLink } from "@/components/popup-link"

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

const allYears = [...new Set([...experiences.map((e) => e.year), ...projects.map((p) => p.year)])].sort((a, b) => b - a)

export function ExperienceSection() {
  return (
    <section className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Experience</h1>
        <p className="text-muted-foreground">
          Internships on the left, projects on the right. Everything here shipped to real users or real benchmarks.
        </p>
      </div>

      {/* Column Headers */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-0 mb-8">
        <div className="text-right pr-8">
          <h2 className="text-lg font-semibold text-primary flex items-center justify-end gap-2">
            <Briefcase className="w-4 h-4" />
            Internships
          </h2>
          <p className="text-sm text-muted-foreground">Professional work experience</p>
        </div>
        <div className="w-16" />
        <div className="text-left pl-8">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Projects
          </h2>
          <p className="text-sm text-muted-foreground">SWE and ML/AI projects</p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-10">
        <div>
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-5">
            <Briefcase className="w-4 h-4" />
            Internships
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} experience={exp} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-5">
            <Code2 className="w-4 h-4" />
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block relative">
        {allYears.map((year, yearIndex) => {
          const yearExperiences = experiences.filter((e) => e.year === year)
          const yearProjects = projects.filter((p) => p.year === year)
          const maxItems = Math.max(yearExperiences.length, yearProjects.length)

          return (
            <div key={year} className="relative">
              {/* Year checkpoint on timeline */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
                <div />
                <div className="flex flex-col items-center">
                  {yearIndex > 0 && <div className="w-0.5 h-8 bg-border" />}
                  <div className="w-14 h-9 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-sm font-bold text-primary-foreground">{year}</span>
                  </div>
                </div>
                <div />
              </div>

              {/* Items for this year */}
              {Array.from({ length: maxItems }).map((_, itemIndex) => (
                <div key={itemIndex} className="grid grid-cols-[1fr_auto_1fr] gap-0">
                  <div className="flex justify-end pr-8 py-3">
                    {yearExperiences[itemIndex] ? (
                      <div className="w-full max-w-md">
                        <ExperienceCard experience={yearExperiences[itemIndex]} alignRight />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div className="flex flex-col items-center w-16">
                    <div className="w-0.5 flex-1 bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 border-2 border-background flex-shrink-0" />
                    <div className="w-0.5 flex-1 bg-border" />
                  </div>

                  <div className="pl-8 py-3">
                    {yearProjects[itemIndex] ? (
                      <div className="w-full max-w-md">
                        <ProjectCard project={yearProjects[itemIndex]} />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              ))}

              {yearIndex < allYears.length - 1 && (
                <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
                  <div />
                  <div className="flex justify-center w-16">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                  <div />
                </div>
              )}
            </div>
          )
        })}
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
              {["AWS", "Docker", "Electron", "CI/CD", "Vercel", "Firebase", "Git", "Jest"].map(
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
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience, alignRight }: { experience: Experience; alignRight?: boolean }) {
  return (
    <article
      className={`p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card ${alignRight ? "text-right" : ""}`}
    >
      <span
        className={`inline-block px-2 py-0.5 text-xs font-mono rounded-md mb-2 ${experience.type === "research" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}
      >
        {experience.type === "research" ? "Research" : "Internship"}
      </span>
      <div className={`flex flex-col gap-0.5 mb-2 ${alignRight ? "items-end" : ""}`}>
        <h3 className="font-medium">{experience.title}</h3>
        <span className="text-sm text-muted-foreground font-mono">{experience.period}</span>
      </div>
      <p className="text-sm text-primary mb-1">{experience.company}</p>
      <p className="text-xs text-muted-foreground mb-3">{experience.location}</p>
      <ul className={`space-y-1.5 ${alignRight ? "text-right" : ""}`}>
        {experience.highlights.map((highlight, i) => (
          <li
            key={i}
            className={`text-sm text-muted-foreground flex items-start gap-2 ${alignRight ? "flex-row-reverse" : ""}`}
          >
            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            {highlight}
          </li>
        ))}
      </ul>
      {experience.certificate && (
        <div className={`mt-3 ${alignRight ? "flex justify-end" : ""}`}>
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

function ProjectCard({ project }: { project: Project }) {
  const categories = project.category.length > 0 ? project.category : ["swe"]

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="p-4 rounded-lg border border-border group-hover:border-primary/50 transition-colors bg-card relative">
        <div className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
        <div className="mb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {categories.map((category) => (
              <span
                key={category}
                className={`inline-block px-2 py-0.5 text-xs font-mono rounded-md ${category === "ml" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}
              >
                {category === "ml" ? "ML/AI" : "SWE"}
              </span>
            ))}
          </div>
          <h3 className="font-medium group-hover:text-primary transition-colors">{project.title}</h3>
          {project.period && <p className="text-sm text-muted-foreground font-mono">{project.period}</p>}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{project.description}</p>
        {project.accuracy && <p className="text-xs text-primary font-medium mb-2">{project.accuracy}</p>}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="px-1.5 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded">
              {tech}
            </span>
          ))}
        </div>
      </article>
    </Link>
  )
}
