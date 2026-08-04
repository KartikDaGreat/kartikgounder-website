import { Art } from "@/components/art"
import { Expander } from "@/components/expander"
import { Reveal } from "@/components/motion/reveal"

type Degree = {
  title: string
  school: string
  period: string
  gpa?: string
  gpaNote?: string
  rank?: { value: string; label: string }
  focus?: string
  current?: boolean
  coursework?: { label: string; items: string[] }[]
}

type SchoolItem = {
  title: string
  school: string
  period: string
}

type LeadershipItem = {
  title: string
  org: string
  period: string
  highlight: string
}

type AccoladeItem = {
  title: string
  org: string
  period: string
  detail?: string
}

const degrees: Degree[] = [
  {
    title: "Master of Science, Computer Science",
    school: "Columbia Engineering",
    period: "Aug 2025 – Dec 2026",
    gpa: "3.62",
    gpaNote: "3.76 cumulative expected at graduation",
    focus: "AI, Machine Learning, Healthcare Applications",
    current: true,
    coursework: [
      {
        label: "Fall 2026",
        items: ["Advanced Software Engineering", "Projects in Computer Science"],
      },
      {
        label: "Spring 2026 · 4.1 GPA",
        items: [
          "User Interface Design",
          "Ethical and Responsible AI",
          "Topics in Software Engineering",
          "Policy for Privacy Technologies",
        ],
      },
      {
        label: "Fall 2025 · 3.1 GPA",
        items: ["Machine Learning", "Databases", "Algorithms", "Computational Learning Theory"],
      },
    ],
  },
  {
    title: "Bachelor of Technology, Computer Science",
    school: "Vellore Institute of Technology",
    period: "May 2021 – May 2025",
    gpa: "9.6/10",
    rank: { value: "11", label: "of 4,000" },
  },
]

const earlierSchooling: SchoolItem[] = [
  { title: "High School, Computer Science", school: "Suguna PIP School", period: "Aug 2019 – Apr 2021" },
  { title: "Middle School", school: "SSVM Institutions", period: "Aug 2017 – May 2019" },
]

const leadership: LeadershipItem[] = [
  {
    title: "Member Secretary, Student Council",
    org: "VIT",
    period: "Sep 2023 – Aug 2024",
    highlight: "Represented 12,000+ students in Academic Council meetings and ran 15+ concurrent events during Yantra.",
  },
  {
    title: "Technical Board Member",
    org: "IEEE Computer Society",
    period: "Aug 2023 – May 2024",
    highlight: "Mentored project teams across AI, IoT, web, and ML tracks; built a speed-detection system for NHAI.",
  },
  {
    title: "Guest Speaker",
    org: "KV Institute of Management",
    period: "Jun 2019 – May 2020",
    highlight: "12 sessions on emerging tech, with AI/ML workshops designed for business cohorts.",
  },
]

const accolades: AccoladeItem[] = [
  {
    title: "Semi-finalist, Innovation Challenge",
    org: "Accenture",
    period: "2023",
    detail: "Selected from 50,000+ teams",
  },
  { title: "Winners, Game Of Codes", org: "IEEE-CS", period: "2023", detail: "1st place among 30+ teams" },
  { title: "Third Place, Cryptic Hunt", org: "ACM-VIT", period: "2022" },
  {
    title: "Blood Donation Camp Organizer",
    org: "VIT",
    period: "2022 – 2024",
    detail: "Planned recurring campus drives",
  },
  {
    title: "Operation HOPE Volunteer",
    org: "Operation HOPE",
    period: "2019 – 2024",
    detail: "Financial literacy outreach",
  },
]

export function AcademicsSection() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Education</h1>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
            Columbia MS in Computer Science, finishing December 2026. Before that, a B.Tech at VIT where I
            graduated 11th out of 4,000, plus student council, an IEEE technical board seat, and a few trophies
            that were mostly an excuse to build things on a deadline.
          </p>
        </div>
        <div className="hidden lg:block">
          <Art
            src="/art/education-campus.png"
            alt="Line illustration of a university building beneath a giant open notebook of study diagrams"
            width={1408}
            height={768}
            className="w-full"
          />
        </div>
      </div>

      {/* Degrees */}
      <div className="mb-14">
        <h2 className="eyebrow mb-5">Degrees</h2>
        <div className="space-y-4">
          {degrees.map((degree) => (
            <Reveal key={degree.school}>
              <DegreeCard degree={degree} />
            </Reveal>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border/60 divide-y divide-border/60">
          {earlierSchooling.map((item) => (
            <div
              key={item.school}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground/80">{item.title}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {item.school} · {item.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership: one line per role, the single strongest fact */}
      <div className="mb-14">
        <h2 className="eyebrow mb-5">Leadership</h2>
        <div className="space-y-2">
          {leadership.map((item) => (
            <Reveal
              key={item.title}
              className="rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="text-xs text-primary">{item.org}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">{item.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.highlight}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Awards & community: a badge wall, not more cards */}
      <div>
        <h2 className="eyebrow mb-5">Awards & community</h2>
        <div className="flex flex-wrap gap-2">
          {accolades.map((item) => (
            <span
              key={item.title}
              className="inline-flex flex-wrap items-baseline gap-x-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:border-primary/50 transition-colors"
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.org}
                {item.detail ? ` · ${item.detail}` : ""} · {item.period}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function DegreeCard({ degree }: { degree: Degree }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {degree.current && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In progress
              </span>
            )}
            <span className="text-xs text-muted-foreground font-mono">{degree.period}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight">{degree.title}</h3>
          <p className="text-sm text-primary mt-0.5">{degree.school}</p>
        </div>

        {/* GPA block, right-aligned on wide screens */}
        {degree.gpa && (
          <div className="flex items-start gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary tracking-tight leading-none">{degree.gpa}</div>
              <div className="text-[11px] text-muted-foreground mt-1">GPA</div>
            </div>
            {degree.rank && (
              <div className="text-right border-l border-border pl-3">
                <div className="text-2xl font-bold tracking-tight leading-none">{degree.rank.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{degree.rank.label}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {(degree.focus || degree.gpaNote) && (
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          {degree.focus && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground/70">Focus:</span> {degree.focus}
            </p>
          )}
          {degree.gpaNote && <p className="text-xs text-muted-foreground">{degree.gpaNote}</p>}
        </div>
      )}

      {degree.coursework && (
        <div className="mt-4 pt-3 border-t border-border">
          <Expander label="coursework">
            <div className="space-y-3 mb-1">
              {degree.coursework.map((term) => (
                <div key={term.label} className="grid md:grid-cols-[160px_1fr] gap-x-4 gap-y-1.5 items-baseline">
                  <p className="text-xs font-mono text-muted-foreground">{term.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {term.items.map((course) => (
                      <span
                        key={course}
                        className="text-[11px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Expander>
        </div>
      )}
    </article>
  )
}
