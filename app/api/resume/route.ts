import { json } from "@/lib/agent-http"
import {
  SITE_URL,
  accolades,
  basics,
  certifications,
  degrees,
  detailedSkills,
  earlierSchooling,
  experiences,
  interests,
  leadership,
  patents,
  principles,
  publications,
  uses,
} from "@/lib/profile"
import { projects } from "@/lib/projects"

export const dynamic = "force-static"

/**
 * The resume in the JSON Resume schema (https://jsonresume.org/schema/),
 * generated from lib/profile.ts and lib/projects.ts so it always matches the
 * site. Extra top-level keys (patents, certificates details, toolchain,
 * principles) are extensions the schema allows.
 */

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

/**
 * "Aug 2025 – Dec 2026", "January - May 2026", "September 2026 - Present",
 * "2025 - Present" → { startDate, endDate } as YYYY-MM (or YYYY). A month
 * without its own year takes the next year mentioned.
 */
function dates(period: string | undefined, fallbackYear?: number): { startDate?: string; endDate?: string } {
  const text = period ?? ""
  const ongoing = /present|current/i.test(text)
  const tokens = [...text.matchAll(/([A-Za-z]+)\.?(?:\s+(\d{4}))?/g)]
    .map(([, word, year]) => ({ month: MONTHS.indexOf(word.slice(0, 3).toLowerCase()), year }))
    .filter((t) => t.month >= 0)
  if (tokens.length) {
    for (let i = tokens.length - 2; i >= 0; i--) tokens[i].year ??= tokens[i + 1].year
    const fmt = (t: (typeof tokens)[number]) =>
      t.year ? `${t.year}-${String(t.month + 1).padStart(2, "0")}` : undefined
    return { startDate: fmt(tokens[0]), endDate: ongoing ? undefined : tokens[1] && fmt(tokens[1]) }
  }
  const years = text.match(/\d{4}/g)
  if (years) return { startDate: years[0], endDate: ongoing ? undefined : years[1] }
  return fallbackYear ? { startDate: String(fallbackYear) } : {}
}

const isCommunity = (title: string) => /volunteer|organizer/i.test(title)

function buildResume() {
  const internships = experiences.filter((e) => e.type === "internship")

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: basics.name,
      label: "Software Engineer & ML Researcher",
      email: basics.email,
      url: SITE_URL,
      summary: `${basics.headline}. ${basics.summary}`,
      location: { city: "New York", region: "NY", countryCode: "US" },
      profiles: [
        { network: "GitHub", username: "KartikDaGreat", url: basics.github },
        { network: "LinkedIn", username: "kartik-gounder", url: basics.linkedin },
      ],
      emails: [
        { address: basics.email, note: "Work, collaborations, and this site" },
        { address: basics.personalEmail, note: "Personal inbox" },
      ],
      availability: basics.availability,
      resumePdf: basics.resume,
    },
    work: experiences.map((e) => ({
      name: e.company,
      position: e.title,
      location: e.location,
      type: e.type,
      startDate: e.start,
      endDate: e.end ?? null,
      current: !!e.current,
      summary: e.summary,
      highlights: e.highlights.map((h) => `${h.lead}: ${h.text}`),
      keywords: e.keywords,
      metrics: e.impact?.map(({ value, label }) => ({ value, label })),
      certificate: e.certificate,
    })),
    education: [
      ...degrees.map((d) => ({
        institution: d.school,
        studyType: d.title.split(",")[0],
        area: d.title.split(",").slice(1).join(",").trim() || undefined,
        ...dates(d.period),
        score: d.gpa,
        scoreNote: d.gpaNote,
        rank: d.rank ? `${d.rank.value} ${d.rank.label}` : undefined,
        focus: d.focus,
        status: d.current ? "In progress" : "Completed",
        courses: d.coursework?.map((c) => ({ term: c.label, items: c.items })),
      })),
      ...earlierSchooling.map((s) => ({ institution: s.school, studyType: s.title, ...dates(s.period) })),
    ],
    certificates: certifications.map((c) => ({
      name: c.title,
      issuer: c.issuer,
      date: dates(c.issued).startDate,
      expires: dates(c.expires).startDate,
      validationNumber: c.validation,
      verifyAt: c.verifyUrl,
      url: `${SITE_URL}${c.file}`,
    })),
    skills: detailedSkills,
    projects: projects.map((p) => ({
      name: p.title,
      slug: p.slug,
      featured: !!p.featured,
      ...dates(p.period, p.year),
      description: p.description,
      role: p.role,
      status: p.status,
      keywords: p.technologies,
      tags: p.tags,
      metrics: p.metrics,
      url: `${SITE_URL}/projects/${p.slug}`,
      github: p.github,
      demo: p.demo ?? p.demos?.[0]?.href,
      paper: p.paper,
    })),
    publications: publications.map((p) => ({
      name: p.title,
      publisher: p.venue,
      releaseDate: p.year,
      authors: p.authors,
      url: p.link,
      summary: p.description,
    })),
    patents: patents.map((p) => ({
      name: p.title,
      status: p.venue,
      releaseDate: p.year,
      authors: p.authors,
      summary: p.description,
    })),
    volunteer: [
      ...leadership.map((l) => ({
        organization: l.org,
        position: l.title,
        ...dates(l.period),
        summary: l.highlight,
      })),
      ...accolades
        .filter((a) => isCommunity(a.title))
        .map((a) => ({ organization: a.org, position: a.title, ...dates(a.period), summary: a.detail })),
    ],
    awards: accolades
      .filter((a) => !isCommunity(a.title))
      .map((a) => ({ title: a.title, awarder: a.org, date: a.period, summary: a.detail })),
    interests,
    principles: principles.map((p) => ({ title: p.title, detail: p.line })),
    toolchain: Object.fromEntries(uses.map((c) => [c.title, c.items.map((i) => `${i.name}: ${i.description}`)])),
    summaryStats: {
      internships: internships.length,
      publishedPapers: publications.length,
      patentApplications: patents.length,
      certifications: certifications.length,
      projects: projects.length,
    },
    meta: {
      version: "v3.0.0",
      canonical: `${SITE_URL}/api/resume`,
      source: "Generated at build time from lib/profile.ts and lib/projects.ts, the same data the site renders.",
      lastModified: new Date().toISOString().slice(0, 10),
    },
  }
}

export function GET() {
  return json(buildResume())
}
