import { Briefcase, Code2 } from "lucide-react"

interface Experience {
  title: string
  company: string
  period: string
  year: number // Added year for sorting
  location: string
  highlights: string[]
  type: "internship" | "research"
}

interface Project {
  title: string
  description: string
  technologies: string[]
  github?: string
  paper?: string
  demo?: string
  period?: string
  year: number // Added year for sorting
  highlights?: string[]
  accuracy?: string
  category: "swe" | "ml"
}

const experiences: Experience[] = [
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
  },
  {
    title: "iXp Intern",
    company: "SAP Labs India",
    period: "June 2024 - August 2024",
    year: 2024,
    location: "Bangalore, India",
    type: "internship",
    highlights: [
      "Designed and developed Farmbot software, achieving a 28% decrease in API call time",
      "Integrated XSUAA authentication using JWT access tokens",
    ],
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
  },
]

const projects: Project[] = [
  {
    title: "On-Device Document Classification",
    description: "Framework to classify documents based on images and limited text for on-device deployment.",
    technologies: ["Python", "CNN", "TensorFlow"],
    period: "January - May 2024",
    year: 2024,
    paper: "#",
    category: "ml",
    highlights: ["3.7M parameter model", "Published at ISEC-2025"],
  },
  {
    title: "Psychological Counselling Chatbot",
    description: "3-modal chatbot for assessing patients' mental states.",
    technologies: ["Python", "Flask", "AngularJS"],
    period: "January - March 2024",
    year: 2024,
    paper: "#",
    category: "ml",
    accuracy: "87% satisfaction",
  },
  {
    title: "Skin Cancer Detection Ensemble",
    description: "Ensemble model using ResNet, EfficientNet, and MobileNet.",
    technologies: ["Python", "PyTorch"],
    period: "October - December 2023",
    year: 2023,
    paper: "#",
    category: "ml",
    accuracy: "96.33%",
  },
  {
    title: "Fake News Origin Detection",
    description: "ML system for detecting the origins of misinformation.",
    technologies: ["Python", "NLP", "Scikit-learn"],
    period: "March - May 2024",
    year: 2024,
    category: "ml",
    accuracy: "96.3%",
  },
  {
    title: "Traffic Speed Detection System",
    description: "Automated Speeding Ticket Framework for NHAI using computer vision.",
    technologies: ["Computer Vision", "IoT", "Python"],
    year: 2023,
    category: "swe",
  },
  {
    title: "Chota-Dhobi Mobile App",
    description: "On-demand laundry services app with real-time tracking.",
    technologies: ["Firebase", "Mobile Dev"],
    github: "https://github.com/KartikDaGreat",
    year: 2023,
    category: "swe",
  },
  {
    title: "Personal Portfolio Website",
    description: "Interactive portfolio with terminal emulator, file management, and dynamic theming.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/KartikDaGreat/kartikgounder-website",
    year: 2025,
    category: "swe",
  },
]

const allYears = [...new Set([...experiences.map((e) => e.year), ...projects.map((p) => p.year)])].sort((a, b) => b - a)

export function ExperienceSection() {
  return (
    <section className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Experience</h1>
      <p className="text-muted-foreground mb-12">Professional experience, internships, and technical projects</p>

      {/* Column Headers */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-0 mb-8">
        <div className="text-right pr-8">
          <h2 className="text-xl font-semibold text-primary flex items-center justify-end gap-2">
            <Briefcase className="w-5 h-5" />
            Internships
          </h2>
          <p className="text-sm text-muted-foreground">Professional work experience</p>
        </div>
        <div className="w-16" />
        <div className="text-left pl-8">
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Projects
          </h2>
          <p className="text-sm text-muted-foreground">SWE and ML/AI projects</p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-12">
        <div>
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5" />
            Internships
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} experience={exp} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5" />
            Projects
          </h2>
          <div className="space-y-4">
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
                  {/* Connecting line from previous year */}
                  {yearIndex > 0 && <div className="w-0.5 h-8 bg-border" />}
                  {/* Year badge */}
                  <div className="w-16 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-sm font-bold text-primary-foreground">{year}</span>
                  </div>
                </div>
                <div />
              </div>

              {/* Items for this year */}
              {Array.from({ length: maxItems }).map((_, itemIndex) => (
                <div key={itemIndex} className="grid grid-cols-[1fr_auto_1fr] gap-0">
                  {/* Left: Internship */}
                  <div className="flex justify-end pr-8 py-3">
                    {yearExperiences[itemIndex] ? (
                      <div className="w-full max-w-md">
                        <ExperienceCard experience={yearExperiences[itemIndex]} alignRight />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Center timeline with dot */}
                  <div className="flex flex-col items-center w-16">
                    <div className="w-0.5 flex-1 bg-border" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/50 border-2 border-background flex-shrink-0" />
                    <div className="w-0.5 flex-1 bg-border" />
                  </div>

                  {/* Right: Project */}
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

              {/* Extra timeline segment if needed */}
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
        <h2 className="text-xl font-semibold mb-6 text-primary">Technical Skills</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-3">Programming & Development</h3>
            <div className="flex flex-wrap gap-2">
              {["C++", "Python", "Java", "PHP", "JavaScript", "AngularJS", "Flask", "Vercel", "Spark"].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">ML/AI & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "AWS", "Docker", "CI/CD", "PostgreSQL"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded"
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
        className={`inline-block px-2 py-0.5 text-xs font-mono rounded mb-2 ${experience.type === "research" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}
      >
        {experience.type === "research" ? "Research" : "Internship"}
      </span>
      <div className={`flex flex-col gap-1 mb-2 ${alignRight ? "items-end" : ""}`}>
        <h3 className="font-medium">{experience.title}</h3>
        <span className="text-sm text-muted-foreground font-mono">{experience.period}</span>
      </div>
      <p className="text-sm text-primary mb-1">{experience.company}</p>
      <p className="text-xs text-muted-foreground mb-3">{experience.location}</p>
      <ul className={`space-y-1 ${alignRight ? "text-right" : ""}`}>
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
    </article>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card">
      <div className="mb-2">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-mono rounded mb-2 ${project.category === "ml" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}
        >
          {project.category === "ml" ? "ML/AI" : "SWE"}
        </span>
        <h3 className="font-medium">{project.title}</h3>
        {project.period && <p className="text-xs text-muted-foreground font-mono">{project.period}</p>}
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
  )
}
