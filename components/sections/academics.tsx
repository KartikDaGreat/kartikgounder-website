import { Award, GraduationCap, ShieldCheck, Trophy } from "lucide-react"

type AcademicItem = {
  title: string
  school: string
  period: string
  gpa?: string
  expectedGpa?: string
  focus?: string
  coursework?: { label: string; items: string[] }[]
  year: number
  startYear: number
  endYear: number
  continuing?: boolean
}

type MilestoneItem = {
  title: string
  school: string
  detail: string
  year: number
}

type LeadershipItem = {
  title: string
  org: string
  period: string
  highlights: string[]
  year: number
}

type AccoladeItem = {
  title: string
  org: string
  period: string
  detail?: string
  year: number
}

const academics: AcademicItem[] = [
  {
    title: "Master of Science · Computer Science",
    school: "Columbia Engineering",
    period: "Aug 2025 – Dec 2026",
    gpa: "3.62",
    expectedGpa: "3.76",
    coursework: [
      {
        label: "Fall 2026 (Expected: 3.76 cumulative GPA)",
        items: ["Advanced Software Engineering", "Projects in Computer Science"],
      },
      {
        label: "Spring 2026 (4.1 GPA)",
        items: ["User Interface Design", "Ethical and Responsible AI", "Topics in Software Engineering", "Policy for Privacy Technologies"],
      },
    ],
    year: 2026,
    startYear: 2026,
    endYear: 2026,
    continuing: true,
  },
  {
    title: "Master of Science · Computer Science",
    school: "Columbia Engineering",
    period: "Aug 2025 – Dec 2026",
    gpa: "3.62",
    expectedGpa: "3.76",
    focus: "AI, Machine Learning, Healthcare Applications",
    coursework: [
      {
        label: "Fall 2025 (3.1 GPA)",
        items: ["Machine Learning", "Databases", "Algorithms", "Computational Learning Theory"],
      },
    ],
    year: 2025,
    startYear: 2025,
    endYear: 2025,
  },
  {
    title: "Bachelor of Technology · Computer Science",
    school: "Vellore Institute of Technology",
    period: "May 2021 – May 2025",
    gpa: "9.6/10",
    year: 2021,
    startYear: 2021,
    endYear: 2024,
  },
  {
    title: "High School · Computer Science",
    school: "Suguna PIP School",
    period: "Aug 2019 – Apr 2021",
    year: 2021,
    startYear: 2019,
    endYear: 2021,
  },
  {
    title: "Middle School",
    school: "SSVM Institutions",
    period: "Aug 2017 – May 2019",
    year: 2019,
    startYear: 2017,
    endYear: 2019,
  },
]

const milestones: MilestoneItem[] = [
  {
    title: "B.Tech Graduated · Computer Science",
    school: "Vellore Institute of Technology",
    detail: "GPA 9.6/10 · Rank 11 of 4,000",
    year: 2025,
  },
]

const leadership: LeadershipItem[] = [
  {
    title: "Member Secretary, Student Council",
    org: "VIT",
    period: "Sep 2023 – Aug 2024",
    year: 2024,
    highlights: [
      "Ran 15+ concurrent events during Yantra and campus hackathons",
      "Represented 12,000+ students in Academic Council meetings",
      "Managed event budgets and treasury for council programs",
    ],
  },
  {
    title: "Technical Board Member",
    org: "IEEE Computer Society",
    period: "Aug 2023 – May 2024",
    year: 2024,
    highlights: [
      "Mentored project teams across AI, IoT, web, and ML tracks",
      "Led weekly technical workshops and build sessions",
      "Built speed-detection system and ticketing framework for NHAI",
    ],
  },
  {
    title: "Guest Speaker",
    org: "KV Institute of Management",
    period: "Jun 2019 – May 2020",
    year: 2020,
    highlights: [
      "Delivered 12 sessions on emerging tech niches",
      "Designed AI/ML workshops tailored for business cohorts",
      "Launched outreach with hackathons and co-op programs",
    ],
  },
]

const accolades: AccoladeItem[] = [
  {
    title: "Semi-finalist · Innovation Challenge",
    org: "Accenture",
    period: "2023",
    detail: "Selected from 50,000+ teams",
    year: 2023,
  },
  {
    title: "Winners · Game Of Codes",
    org: "IEEE-CS",
    period: "2023",
    detail: "1st place among 30+ teams",
    year: 2023,
  },
  {
    title: "Third Place · Cryptic Hunt",
    org: "ACM-VIT",
    period: "2022",
    year: 2022,
  },
  {
    title: "Blood Donation Camp Organizer",
    org: "VIT",
    period: "2022 – 2024",
    detail: "Planned recurring campus drives",
    year: 2024,
  },
  {
    title: "Operation HOPE Volunteer",
    org: "Operation HOPE",
    period: "2019 – 2024",
    detail: "Financial literacy outreach",
    year: 2024,
  },
]

const allYears = [...new Set([...academics, ...leadership, ...accolades, ...milestones].map((item) => item.year))]
  .filter((y) => y > 0)
  .sort((a, b) => b - a)

export function AcademicsSection() {
  return (
    <section className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Academics</h1>
        <p className="text-muted-foreground">Education, leadership, and achievements</p>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-10">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <GraduationCap className="w-5 h-5" />
            Education
          </h2>
          <div className="space-y-4">
            {academics.map((item, idx) => (
              <AcademicCard key={idx} item={item} />
            ))}
            {milestones.map((item, idx) => (
              <MilestoneCard key={idx} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <ShieldCheck className="w-5 h-5" />
            Leadership
          </h2>
          <div className="space-y-4">
            {leadership.map((item, idx) => (
              <LeadershipCard key={idx} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <Trophy className="w-5 h-5" />
            Awards & Community
          </h2>
          <div className="space-y-4">
            {accolades.map((item, idx) => (
              <AccoladeCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="space-y-2">
          {allYears.map((year, yearIndex) => {
            const yearLeadership = leadership.filter((l) => l.year === year)
            const yearAccolades = accolades.filter((a) => a.year === year)
            const yearMilestones = milestones.filter((m) => m.year === year)
            const yearAcademics = academics.filter((a) => a.year === year)
            const spanningAcademics = academics.filter((a) => a.year !== year && year >= a.startYear && year <= a.endYear)

            const hasContent = yearAcademics.length > 0 || spanningAcademics.length > 0 || yearLeadership.length > 0 || yearAccolades.length > 0 || yearMilestones.length > 0
            if (!hasContent) return null

            const hasEducation = yearAcademics.length > 0 || spanningAcademics.length > 0 || yearMilestones.length > 0
            const rightContent = yearLeadership.concat(yearAccolades as any)

            return (
              <div key={year}>
                {yearIndex > 0 && <div className="h-px bg-border my-8" />}

                <div className="text-sm font-bold text-foreground mb-4">{year}</div>

                {hasEducation && rightContent.length > 0 ? (
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      {yearAcademics.map((academic, idx) => (
                        <AcademicCard key={idx} item={academic} />
                      ))}
                      {spanningAcademics.length > 0 && yearAcademics.length === 0 && yearMilestones.length === 0 && (
                        <SpanningIndicator schools={spanningAcademics.map((a) => a.school)} />
                      )}
                      {yearMilestones.map((item, idx) => (
                        <MilestoneCard key={`m-${idx}`} item={item} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {yearLeadership.map((item, idx) => (
                          <LeadershipCard key={idx} item={item} />
                        ))}
                      </div>
                      <div className="space-y-3">
                        {yearAccolades.map((item, idx) => (
                          <AccoladeCard key={idx} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : hasEducation ? (
                  <div className="mb-8 max-w-xl">
                    <div className="space-y-3">
                      {yearAcademics.map((academic, idx) => (
                        <AcademicCard key={idx} item={academic} />
                      ))}
                      {spanningAcademics.length > 0 && yearAcademics.length === 0 && yearMilestones.length === 0 && (
                        <SpanningIndicator schools={spanningAcademics.map((a) => a.school)} />
                      )}
                      {yearMilestones.map((item, idx) => (
                        <MilestoneCard key={`m-${idx}`} item={item} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-3">
                      {yearLeadership.map((item, idx) => (
                        <LeadershipCard key={idx} item={item} />
                      ))}
                    </div>
                    <div className="space-y-3">
                      {yearAccolades.map((item, idx) => (
                        <AccoladeCard key={idx} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SpanningIndicator({ schools }: { schools: string[] }) {
  return (
    <div className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-4 py-2">
      {schools.join(", ")}
    </div>
  )
}

function AcademicCard({ item }: { item: AcademicItem }) {
  return (
    <article className="p-5 border-l-2 border-primary/50 rounded-r-lg bg-card/50">
      {item.continuing ? (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary">Continuing</span>
        </div>
      ) : null}
      <h3 className="font-semibold text-foreground">{item.title}</h3>
      <p className="text-sm text-primary mt-1">{item.school}</p>
      <p className="text-xs text-muted-foreground mt-1">{item.period}</p>
      {(item.gpa || item.expectedGpa) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {item.gpa && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20">
              GPA: {item.gpa}
            </span>
          )}
        </div>
      )}
      {item.focus && <p className="text-xs text-muted-foreground mt-3">{item.focus}</p>}
      {item.coursework && (
        <div className="mt-4 space-y-3">
          {item.coursework.map((cw, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground/80">{cw.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {cw.items.map((course) => (
                  <span
                    key={course}
                    className="text-[11px] px-2 py-1 rounded-full bg-muted text-foreground border border-border"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

function MilestoneCard({ item }: { item: MilestoneItem }) {
  return (
    <article className="p-5 border-l-2 border-primary bg-primary/5 rounded-r-lg">
      <div className="flex items-center gap-2 mb-1">
        <Award className="w-4 h-4 text-primary flex-shrink-0" />
        <h3 className="font-semibold text-foreground">{item.title}</h3>
      </div>
      <p className="text-sm text-primary mt-1">{item.school}</p>
      <p className="text-sm text-muted-foreground mt-2 font-medium">{item.detail}</p>
    </article>
  )
}

function LeadershipCard({ item }: { item: LeadershipItem }) {
  return (
    <article className="p-4 border-l-2 border-border rounded-r-lg bg-card/30">
      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
      <p className="text-xs text-primary mt-1">{item.org}</p>
      <p className="text-xs text-muted-foreground mt-1">{item.period}</p>
      <ul className="mt-3 space-y-1">
        {item.highlights.map((highlight, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function AccoladeCard({ item }: { item: AccoladeItem }) {
  return (
    <article className="p-4 border-l-2 border-border rounded-r-lg bg-card/30">
      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
      <p className="text-xs text-primary mt-1">{item.org}</p>
      <p className="text-xs text-muted-foreground mt-1">{item.period}</p>
      {item.detail && <p className="text-xs text-muted-foreground mt-2">{item.detail}</p>}
    </article>
  )
}
