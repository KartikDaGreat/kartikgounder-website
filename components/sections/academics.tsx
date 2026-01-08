import { Award, GraduationCap, ShieldCheck, Trophy, Users } from "lucide-react"

type AcademicItem = {
  title: string
  school: string
  period: string
  gpa?: string
  focus?: string
  year?: number
}

type LeadershipItem = {
  title: string
  org: string
  period: string
  highlights: string[]
  year?: number
}

type AccoladeItem = {
  title: string
  org: string
  period: string
  detail?: string
  year?: number
}

const academics: AcademicItem[] = [
  {
    title: "Master of Science · Computer Science",
    school: "Columbia Engineering",
    period: "Aug 2025 – Dec 2026",
    focus: "AI, Machine Learning, Healthcare Applications",
  },
  {
    title: "B.Tech · Computer Science",
    school: "Vellore Institute of Technology",
    period: "May 2021 – May 2025",
    gpa: "9.6/10",
  },
  {
    title: "High School · Computer Science",
    school: "Suguna PIP School",
    period: "Aug 2019 – Apr 2021",
  },
  {
    title: "Middle School",
    school: "SSVM Institutions",
    period: "Aug 2017 – May 2019",
  },
]

const leadership: LeadershipItem[] = [
  {
    title: "Member Secretary, Student Council",
    org: "VIT",
    period: "Sep 2023 – Aug 2024",
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
  },
  {
    title: "Winners · Game Of Codes",
    org: "IEEE-CS",
    period: "2023",
    detail: "1st place among 30+ teams",
  },
  {
    title: "Third Place · Cryptic Hunt",
    org: "ACM-VIT",
    period: "2022",
  },
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
const extractYear = (period: string): number => {
  const match = period.match(/(20\d{2}|19\d{2})/g)
  if (!match || match.length === 0) return 0
  // use the last year in the range (e.g., 2025–2026 => 2026)
  return Number(match[match.length - 1])
}

const academicsByYear = academics.map((a) => ({ ...a, year: extractYear(a.period) }))
const leadershipByYear = leadership.map((l) => ({ ...l, year: extractYear(l.period) }))
const accoladesByYear = accolades.map((a) => ({ ...a, year: extractYear(a.period) }))

const allYears = Array.from(
  new Set([...academicsByYear, ...leadershipByYear, ...accoladesByYear].map((item) => item.year || 0)),
)
  .filter((y) => y > 0)
  .sort((a, b) => b - a)

export function AcademicsSection() {
  return (
    <section className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Academics</h1>
      <p className="text-muted-foreground mb-12">Academic track on the left, leadership and accolades on the right</p>

      {/* Mobile layout */}
      <div className="md:hidden space-y-10">
        <div>
          <SectionHeader icon={GraduationCap} label="Academics" />
          <div className="mt-4 space-y-4">
            {academics.map((item, idx) => (
              <AcademicCard key={idx} item={item} />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <SectionHeader icon={ShieldCheck} label="Leadership" />
            <div className="mt-4 space-y-4">
              {leadership.map((item, idx) => (
                <LeadershipCard key={idx} item={item} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader icon={Trophy} label="Awards & Community" />
            <div className="mt-4 space-y-4">
              {accolades.map((item, idx) => (
                <AccoladeCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout grouped by year, timeline style */}
      <div className="hidden md:block space-y-10">
        {allYears.map((year) => {
          const yearAcademics = academicsByYear.filter((a) => a.year === year)
          const yearLeadership = leadershipByYear.filter((l) => l.year === year)
          const yearAccolades = accoladesByYear.filter((a) => a.year === year)

          return (
            <div key={year} className="grid grid-cols-[1fr_auto_1.25fr] gap-0">
              <div className="pr-8">
                <SectionHeader icon={GraduationCap} label="Academics" align="right" subtle />
                <p className="text-sm text-muted-foreground text-right">{year} · Coursework & GPA</p>
                <div className="mt-4 space-y-4">
                  {yearAcademics.length ? yearAcademics.map((item, idx) => <AcademicCard key={idx} item={item} alignRight />) : <EmptySlot label="No academics" align="right" />}
                </div>
              </div>

              <div className="flex flex-col items-center w-16">
                <div className="w-0.5 flex-1 bg-border" />
                <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/30">
                  {year}
                </div>
                <div className="w-0.5 flex-1 bg-border" />
              </div>

              <div className="pl-8 py-1">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <SectionHeader icon={ShieldCheck} label="Leadership" subtle />
                    <p className="text-sm text-muted-foreground">Roles, impact, events</p>
                    <div className="mt-3 space-y-4">
                      {yearLeadership.length ? yearLeadership.map((item, idx) => <LeadershipCard key={idx} item={item} />) : <EmptySlot label="No leadership" />}
                    </div>
                  </div>
                  <div>
                    <SectionHeader icon={Trophy} label="Awards & Community" subtle />
                    <p className="text-sm text-muted-foreground">Hackathons, awards, service</p>
                    <div className="mt-3 space-y-4">
                      {yearAccolades.length ? yearAccolades.map((item, idx) => <AccoladeCard key={idx} item={item} />) : <EmptySlot label="No awards" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function EmptySlot({ label, align }: { label: string; align?: "left" | "right" }) {
  return (
    <div className={`text-sm text-muted-foreground/70 border border-dashed border-border rounded-lg p-3 ${align === "right" ? "text-right" : ""}`}>
      {label}
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  label,
  align,
  subtle,
}: {
  icon: typeof GraduationCap
  label: string
  align?: "left" | "right"
  subtle?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
      <Icon className={`w-5 h-5 ${subtle ? "text-primary" : "text-primary"}`} />
      <h2 className="text-xl font-semibold text-foreground">{label}</h2>
    </div>
  )
}

function AcademicCard({ item, alignRight }: { item: AcademicItem; alignRight?: boolean }) {
  return (
    <article
      className={`p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors ${alignRight ? "text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded mb-2">
        <GraduationCap className="w-3.5 h-3.5" />
        Academics
      </span>
      <h3 className="font-medium text-foreground leading-tight">{item.title}</h3>
      <p className="text-sm text-primary mt-1">{item.school}</p>
      <p className="text-xs text-muted-foreground font-mono mt-1">{item.period}</p>
      {item.gpa && <p className="text-sm text-muted-foreground mt-2">GPA: {item.gpa}</p>}
      {item.focus && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.focus}</p>}
    </article>
  )
}

function LeadershipCard({ item }: { item: LeadershipItem }) {
  return (
    <article className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded mb-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        Leadership
      </span>
      <h3 className="font-medium text-foreground leading-tight">{item.title}</h3>
      <p className="text-sm text-primary mt-1">{item.org}</p>
      <p className="text-xs text-muted-foreground font-mono mt-1">{item.period}</p>
      <ul className="mt-3 space-y-1.5">
        {item.highlights.map((highlight, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  )
}

function AccoladeCard({ item }: { item: AccoladeItem }) {
  return (
    <article className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded mb-2">
        {item.title.toLowerCase().includes("volunteer") ? <Users className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
        {item.title.toLowerCase().includes("volunteer") ? "Community" : "Awards"}
      </span>
      <h3 className="font-medium text-foreground leading-tight">{item.title}</h3>
      <p className="text-sm text-primary mt-1">{item.org}</p>
      <p className="text-xs text-muted-foreground font-mono mt-1">{item.period}</p>
      {item.detail && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.detail}</p>}
    </article>
  )
}
