import { GraduationCap, Trophy, Award, Users } from "lucide-react"

interface TimelineEntry {
  type: "education" | "achievement" | "leadership" | "community"
  title: string
  subtitle?: string
  organization: string
  period: string
  description?: string
  highlights?: string[]
  gpa?: string
}

const timelineEntries: TimelineEntry[] = [
  {
    type: "education",
    title: "Master of Science in Computer Science",
    organization: "Columbia Engineering",
    period: "August 2025 - December 2026",
    description: "Focus on AI, Machine Learning, and Healthcare Applications",
  },
  {
    type: "education",
    title: "Bachelor of Technology - BTech, Computer Science",
    organization: "Vellore Institute of Technology (VIT), Vellore",
    period: "May 2021 - May 2025",
    gpa: "9.6/10",
  },
  {
    type: "leadership",
    title: "Member Secretary on the Student Council",
    organization: "Vellore Institute of Technology",
    period: "September 2023 - August 2024",
    highlights: [
      "Organized and managed multiple hackathons and overnight events, overseeing 15+ simultaneous activities during Yantra",
      "Represented the perspective of 12,000+ students in Academic Council meetings",
      "Served as treasurer for events, managing budgets efficiently",
    ],
  },
  {
    type: "leadership",
    title: "Technical Board Member",
    organization: "IEEE Computer Society",
    period: "August 2023 - May 2024",
    highlights: [
      "Mentored students in developing innovative projects and technical initiatives",
      "Led weekly workshops across diverse technical domains (AI, IoT, Web, and ML)",
      "Developed a Traffic Speed Detection System and Automated Speeding Ticket Framework for NHAI",
    ],
  },
  {
    type: "achievement",
    title: "Semi-finalist - Accenture Innovation Challenge",
    organization: "Accenture",
    period: "2023",
    description: "Top placement out of 50,000 participating teams",
  },
  {
    type: "achievement",
    title: "Winners - Game Of Codes Hackathon",
    organization: "IEEE-CS",
    period: "2023",
    description: "First place out of 30+ teams",
  },
  {
    type: "achievement",
    title: "Third Place - Cryptic Hunt Hackathon",
    organization: "ACM-VIT",
    period: "2022",
    description: "Third place out of 17 teams",
  },
  {
    type: "community",
    title: "Blood Donation Camp Organizer",
    organization: "VIT",
    period: "2022 - 2024",
    description: "Hosted and arranged blood donation camps at VIT",
  },
  {
    type: "community",
    title: "Operation HOPE Volunteer",
    organization: "Operation HOPE",
    period: "2019 - 2024",
    description: "Helped spread financial literacy through initiatives and programs",
  },
  {
    type: "leadership",
    title: "Guest Speaker",
    organization: "KV Institute of Management and Information Studies",
    period: "June 2019 - May 2020",
    highlights: [
      "Conducted 12 sessions regarding up-and-coming Tech Niches around the world",
      "Organized workshops for AI and ML development in the field of business",
      "Developed an outreach program with Hackathons and Co-op Programs",
    ],
  },
  {
    type: "education",
    title: "High School, Computer Science",
    organization: "Suguna PIP School",
    period: "August 2019 - April 2021",
  },
  {
    type: "education",
    title: "Middle School",
    organization: "SSVM Institutions",
    period: "August 2017 - May 2019",
  },
]

const getIcon = (type: TimelineEntry["type"]) => {
  switch (type) {
    case "education":
      return GraduationCap
    case "achievement":
      return Trophy
    case "leadership":
      return Award
    case "community":
      return Users
  }
}

const getTypeLabel = (type: TimelineEntry["type"]) => {
  switch (type) {
    case "education":
      return "Education"
    case "achievement":
      return "Achievement"
    case "leadership":
      return "Leadership"
    case "community":
      return "Community"
  }
}

export function AcademicsSection() {
  return (
    <section className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Academics</h1>
      <p className="text-muted-foreground mb-12">Education, achievements, leadership, and community involvement</p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {timelineEntries.map((entry, index) => {
            const Icon = getIcon(entry.type)
            return (
              <article key={index} className="relative pl-12 md:pl-16">
                {/* Timeline dot with icon */}
                <div className="absolute left-0 md:left-2 top-0 w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>

                {/* Content card */}
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  {/* Type badge */}
                  <span className="inline-block px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded mb-2">
                    {getTypeLabel(entry.type)}
                  </span>

                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-1">
                    <h3 className="text-lg font-medium">{entry.title}</h3>
                    <span className="text-sm text-muted-foreground font-mono">{entry.period}</span>
                  </div>

                  <p className="text-sm text-primary mb-2">{entry.organization}</p>

                  {entry.gpa && <p className="text-sm text-muted-foreground mb-2">GPA: {entry.gpa}</p>}

                  {entry.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                  )}

                  {entry.highlights && entry.highlights.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {entry.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
