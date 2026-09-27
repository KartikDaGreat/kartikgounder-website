import { projects, projectLinks, type Project } from "@/lib/projects"
import {
  SITE_URL,
  accolades,
  basics,
  certifications,
  degrees,
  experiences,
  leadership,
  now,
  patents,
  proof,
  publications,
  recently,
  skills,
  TYPE_LABEL,
  type Experience,
  type Publication,
} from "@/lib/profile"

/**
 * Everything an agent reads comes from here: the markdown documents behind
 * /llms.txt, /llms-full.txt and the *.md routes, and the passages that
 * /api/agent/search ranks. Built from lib/profile.ts and lib/projects.ts, the
 * same data the UI renders, so nothing here is written by hand twice.
 */

export interface AgentDoc {
  id: string
  title: string
  /** Where an agent fetches this document as markdown. */
  path: string
  /** Where a person sees the same content in the UI. */
  page: string
  description: string
  markdown: string
}

/** One self-contained fact, small enough to hand an agent on its own. */
export interface Passage {
  id: string
  kind: "profile" | "role" | "project" | "publication" | "patent" | "education" | "certification" | "skills" | "contact"
  title: string
  /** Markdown source for the passage's context. */
  source: string
  page: string
  text: string
  /** Extra words that should match but read badly in the text itself. */
  keywords?: string[]
}

const abs = (path: string) => `${SITE_URL}${path}`
const bullet = (items: string[]) => items.map((i) => `- ${i}`).join("\n")

// ---- Formatters ----

function roleMarkdown(e: Experience, level = "###"): string {
  const lines = [
    `${level} ${e.title}, ${e.company}`,
    `${e.period} · ${e.location} · ${TYPE_LABEL[e.type]}${e.current ? " · current" : ""}`,
  ]
  if (e.impact?.length) lines.push("", `Impact: ${e.impact.map((i) => `${i.value} ${i.label}`).join("; ")}`)
  lines.push("", bullet(e.highlights.map((h) => `**${h.lead}**: ${h.text}`)))
  if (e.certificate) lines.push("", `Certificate: ${e.certificate}`)
  return lines.join("\n")
}

function publicationMarkdown(p: Publication): string {
  const lines = [`### ${p.title}`, `${p.venue}, ${p.year} · ${p.authors}`]
  if (p.description) lines.push("", p.description)
  if (p.link) lines.push("", `DOI: ${p.link}`)
  return lines.join("\n")
}

function projectName(p: Project) {
  return p.title.split(/:\s+/)[0]
}

export function projectMarkdown(p: Project): string {
  const out = [`# ${p.title}`, "", p.description, ""]
  const facts = [
    p.period ? `Period: ${p.period}` : `Year: ${p.year}`,
    p.role && `Role: ${p.role}`,
    p.status && `Status: ${p.status}`,
    `Stack: ${p.technologies.join(", ")}`,
    p.tags?.length && `Tags: ${p.tags.join(", ")}`,
    p.accuracy && `Accuracy: ${p.accuracy}`,
  ].filter(Boolean) as string[]
  out.push(bullet(facts))

  const links = projectLinks(p)
  if (links.length) {
    out.push("", "## Links", bullet(links.map((l) => `${l.label}: ${l.href}${l.note ? ` (${l.note})` : ""}`)))
  }
  if (p.metrics?.length) out.push("", "## Results", bullet(p.metrics.map((m) => `**${m.value}** ${m.label}`)))
  if (p.story) {
    out.push("", "## Problem", p.story.problem.join("\n\n"))
    out.push("", "## Approach", p.story.approach.join("\n\n"))
    out.push("", "## Outcome", p.story.outcome.join("\n\n"))
    if (p.story.lessons?.length) out.push("", "## Lessons", p.story.lessons.join("\n\n"))
  } else if (p.longDescription?.length) {
    out.push("", "## Details", p.longDescription.join("\n\n"))
  }
  if (p.architecture) out.push("", "## Architecture", "```", p.architecture, "```")
  if (p.highlights?.length) out.push("", "## Highlights", bullet(p.highlights))
  out.push("", `Page: ${abs(`/projects/${p.slug}`)}`)
  return out.join("\n")
}

// ---- Documents ----

function profileDoc(): AgentDoc {
  const md = [
    `# ${basics.name}`,
    "",
    `> ${basics.headline}.`,
    "",
    basics.summary,
    "",
    "## Right now (Fall 2026)",
    bullet(now.map((n) => `**${n.role}**, ${n.org} (${n.kind}): ${n.detail}`)),
    "",
    "## Headline results",
    bullet(proof.map((p) => `**${p.value}** ${p.label} (${p.where}): ${p.detail}`)),
    "",
    "## Recently",
    ...recently.map((r) => `### ${r.when}: ${r.title}\n\n${r.body.join("\n\n")}`),
    "",
    "## Availability",
    basics.availability,
    "",
    "## Contact",
    bullet([
      `Email: ${basics.email} (work, collaborations)`,
      `Personal email: ${basics.personalEmail}`,
      `GitHub: ${basics.github}`,
      `LinkedIn: ${basics.linkedin}`,
      `Resume (PDF): ${basics.resume}`,
      `Location: ${basics.location}`,
    ]),
  ].join("\n")
  return {
    id: "profile",
    title: "Profile",
    path: "/profile.md",
    page: abs("/#home"),
    description: "Who Kartik is, current roles, headline results, availability, and contact",
    markdown: md,
  }
}

function workDoc(): AgentDoc {
  const current = experiences.filter((e) => e.current)
  const past = experiences.filter((e) => !e.current)
  const md = [
    "# Work experience",
    "",
    "## Current",
    ...current.map((e) => roleMarkdown(e)),
    "",
    "## Previous (newest first)",
    ...past.map((e) => roleMarkdown(e)),
    "",
    "## Technical skills",
    bullet(skills.map((s) => `${s.label}: ${s.items.join(", ")}`)),
  ].filter(Boolean).join("\n\n")
  return {
    id: "work",
    title: "Work experience",
    path: "/work.md",
    page: abs("/#work"),
    description: "Every role with dates, location, measured impact, and technical skills",
    markdown: md,
  }
}

function projectsDoc(): AgentDoc {
  const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.year - a.year)
  const md = [
    "# Projects",
    "",
    "Featured first, then newest. Each has a full write-up at the linked markdown URL.",
    "",
    ...sorted.map((p) => {
      const metric = p.metrics?.[0]
      return [
        `## ${p.title}${p.featured ? " (featured)" : ""}`,
        `${p.year} · ${p.technologies.slice(0, 6).join(", ")}`,
        "",
        p.description,
        metric ? `\nTop result: **${metric.value}** ${metric.label}` : "",
        `\nFull write-up: ${abs(`/projects/${p.slug}.md`)}`,
      ].join("\n")
    }),
  ].filter(Boolean).join("\n\n")
  return {
    id: "projects",
    title: "Projects",
    path: "/projects.md",
    page: abs("/#projects"),
    description: "Every project with a one-paragraph summary, top result, and a link to its full write-up",
    markdown: md,
  }
}

function researchDoc(): AgentDoc {
  const md = [
    "# Research",
    "",
    "## Current research",
    ...experiences.filter((e) => e.current && e.type === "research").map((e) => roleMarkdown(e, "###")),
    "",
    "## Peer-reviewed papers",
    ...publications.map(publicationMarkdown),
    "",
    "## Patent applications",
    ...patents.map(publicationMarkdown),
  ].filter(Boolean).join("\n\n")
  return {
    id: "research",
    title: "Research",
    path: "/research.md",
    page: abs("/#research"),
    description: "Current research, three peer-reviewed papers with DOIs, and two patent applications",
    markdown: md,
  }
}

function educationDoc(): AgentDoc {
  const md = [
    "# Education",
    ...degrees.map((d) =>
      [
        `## ${d.title}, ${d.school}`,
        `${d.period}${d.current ? " · in progress" : ""}`,
        "",
        bullet(
          [
            d.gpa && `GPA: ${d.gpa}${d.gpaNote ? ` (${d.gpaNote})` : ""}`,
            d.rank && `Rank: ${d.rank.value} ${d.rank.label}`,
            d.focus && `Focus: ${d.focus}`,
          ].filter(Boolean) as string[],
        ),
        ...(d.coursework ?? []).map((c) => `\n**${c.label}**: ${c.items.join(", ")}`),
      ].join("\n"),
    ),
    "## Certifications",
    bullet(
      certifications.map(
        (c) =>
          `**${c.title}**, ${c.issuer}. Issued ${c.issued}, valid to ${c.expires}. Validation number ${c.validation} at ${c.verifyUrl}. Certificate: ${abs(c.file)}`,
      ),
    ),
    "## Leadership",
    bullet(leadership.map((l) => `**${l.title}**, ${l.org} (${l.period}): ${l.highlight}`)),
    "## Awards and community",
    bullet(accolades.map((a) => `**${a.title}**, ${a.org} (${a.period})${a.detail ? `: ${a.detail}` : ""}`)),
  ].filter(Boolean).join("\n\n")
  return {
    id: "education",
    title: "Education",
    path: "/education.md",
    page: abs("/#education"),
    description: "Degrees, GPA, coursework, certifications, leadership, and awards",
    markdown: md,
  }
}

let cachedDocs: AgentDoc[] | null = null

export function agentDocs(): AgentDoc[] {
  cachedDocs ??= [profileDoc(), workDoc(), projectsDoc(), researchDoc(), educationDoc()]
  return cachedDocs
}

export function agentDoc(id: string): AgentDoc | undefined {
  return agentDocs().find((d) => d.id === id)
}

// ---- llms.txt ----

export function llmsTxt(): string {
  const featured = projects.filter((p) => p.featured)
  return [
    `# ${basics.name}`,
    "",
    `> ${basics.headline}. ${basics.summary}`,
    "",
    "The site's UI is a client-rendered single page, so fetch the markdown below instead of scraping HTML. Every document is generated from the same data the UI renders.",
    "",
    "## Right now",
    bullet(now.map((n) => `${n.role}, ${n.org}: ${n.detail}`)),
    "",
    "## Ask for just what you need",
    bullet([
      `[Search](${abs("/api/agent/search?q=")}): \`GET /api/agent/search?q=<question>&limit=5\` returns the most relevant passages as JSON, each with its source URL. Optional \`kind\` filter: ${[
        "profile",
        "role",
        "project",
        "publication",
        "patent",
        "education",
        "certification",
        "skills",
        "contact",
      ].join(", ")}.`,
      `[Structured data](${abs("/api/agent")}): \`GET /api/agent\` returns the whole profile as JSON.`,
      `[Everything](${abs("/llms-full.txt")}): every document below in one markdown file.`,
    ]),
    "",
    "## Documents",
    bullet(agentDocs().map((d) => `[${d.title}](${abs(d.path)}): ${d.description}`)),
    "",
    "## Featured projects",
    bullet(featured.map((p) => `[${projectName(p)}](${abs(`/projects/${p.slug}.md`)}): ${p.title.split(/:\s+/)[1] ?? p.description}`)),
    "",
    "## Optional",
    bullet([
      ...projects
        .filter((p) => !p.featured)
        .map((p) => `[${projectName(p)}](${abs(`/projects/${p.slug}.md`)}): ${p.year}`),
      `[JSON Resume](${abs("/api/resume")}): the resume in the jsonresume.org schema`,
    ]),
    "",
    "## Contact",
    `${basics.email} · ${basics.github} · ${basics.linkedin}`,
    "",
  ].join("\n")
}

export function llmsFullTxt(): string {
  const docs = agentDocs().map((d) => d.markdown)
  const projectPages = projects.map(projectMarkdown)
  return [...docs, "# Project write-ups", ...projectPages].join("\n\n---\n\n") + "\n"
}

// ---- Passages for search ----

let cachedPassages: Passage[] | null = null

export function passages(): Passage[] {
  if (cachedPassages) return cachedPassages
  const out: Passage[] = []

  out.push({
    id: "profile/summary",
    kind: "profile",
    title: `About ${basics.name}`,
    source: abs("/profile.md"),
    page: abs("/#home"),
    text: `${basics.headline}. ${basics.summary} ${basics.availability}`,
    keywords: ["who", "about", "bio", "summary", "hire", "available", "graduating", "open", "roles"],
  })
  for (const p of proof) {
    out.push({
      id: `profile/result/${p.value}`,
      kind: "profile",
      title: `${p.value} ${p.label}`,
      source: abs("/profile.md"),
      page: abs("/#home"),
      text: `${p.value} ${p.label} (${p.where}). ${p.detail}`,
      keywords: ["impact", "result", "achievement"],
    })
  }
  out.push({
    id: "contact",
    kind: "contact",
    title: "Contact",
    source: abs("/profile.md"),
    page: abs("/#contact"),
    text: `Email ${basics.email} for work and collaborations, or ${basics.personalEmail}. GitHub ${basics.github}. LinkedIn ${basics.linkedin}. Resume ${basics.resume}. Based in ${basics.location}.`,
    keywords: ["email", "reach", "contact", "linkedin", "github", "resume", "cv", "location"],
  })

  for (const e of experiences) {
    out.push({
      id: `role/${e.company}/${e.title}`.toLowerCase().replace(/[^a-z0-9/]+/g, "-"),
      kind: "role",
      title: `${e.title}, ${e.company}`,
      source: abs(e.type === "research" && e.current ? "/research.md" : "/work.md"),
      page: abs("/#work"),
      text: roleMarkdown(e).replace(/^### /, ""),
      keywords: [
        e.type,
        TYPE_LABEL[e.type],
        String(e.year),
        "experience work job",
        e.current ? "current now present" : "previous past",
      ],
    })
  }

  for (const p of projects) {
    const summary = [
      p.description,
      p.metrics?.length ? `Results: ${p.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}.` : "",
      `Stack: ${p.technologies.join(", ")}.`,
      p.role ? `Role: ${p.role}.` : "",
      projectLinks(p)
        .map((l) => `${l.label}: ${l.href}`)
        .join(". "),
    ]
      .filter(Boolean)
      .join(" ")
    const base = {
      kind: "project" as const,
      source: abs(`/projects/${p.slug}.md`),
      page: abs(`/projects/${p.slug}`),
      keywords: [...(p.tags ?? []), ...p.category, String(p.year), projectName(p)],
    }
    out.push({ ...base, id: `project/${p.slug}`, title: p.title, text: summary })
    if (p.story) {
      out.push({
        ...base,
        id: `project/${p.slug}/story`,
        title: `${projectName(p)}: problem and approach`,
        text: [...p.story.problem, ...p.story.approach].join(" "),
      })
      out.push({
        ...base,
        id: `project/${p.slug}/outcome`,
        title: `${projectName(p)}: outcome and lessons`,
        text: [...p.story.outcome, ...(p.story.lessons ?? [])].join(" "),
      })
    }
  }

  for (const p of [...publications, ...patents]) {
    out.push({
      id: `${p.type}/${p.title}`.toLowerCase().replace(/[^a-z0-9/]+/g, "-").slice(0, 80),
      kind: p.type === "paper" ? "publication" : "patent",
      title: p.title,
      source: abs("/research.md"),
      page: abs("/#research"),
      text: publicationMarkdown(p).replace(/^### /, ""),
      keywords: p.type === "paper" ? ["paper", "publication", "published", "research"] : ["patent", "invention"],
    })
  }

  for (const d of degrees) {
    out.push({
      id: `education/${d.school}`.toLowerCase().replace(/[^a-z0-9/]+/g, "-"),
      kind: "education",
      title: `${d.title}, ${d.school}`,
      source: abs("/education.md"),
      page: abs("/#education"),
      text: [
        `${d.title}, ${d.school}, ${d.period}.`,
        d.gpa && `GPA ${d.gpa}${d.gpaNote ? ` (${d.gpaNote})` : ""}.`,
        d.rank && `Ranked ${d.rank.value} ${d.rank.label}.`,
        d.focus && `Focus: ${d.focus}.`,
        ...(d.coursework ?? []).map((c) => `${c.label}: ${c.items.join(", ")}.`),
      ]
        .filter(Boolean)
        .join(" "),
      keywords: ["degree", "university", "school", "gpa", "coursework", "classes", "study"],
    })
  }
  for (const c of certifications) {
    out.push({
      id: `certification/${c.title}`.toLowerCase().replace(/[^a-z0-9/]+/g, "-"),
      kind: "certification",
      title: c.title,
      source: abs("/education.md"),
      page: abs("/#education"),
      text: `${c.title}, issued by ${c.issuer} ${c.issued}, valid to ${c.expires}. Validation number ${c.validation} at ${c.verifyUrl}. Certificate PDF: ${abs(c.file)}.`,
      keywords: ["certification", "certified", "certificate", "credential", "cloud"],
    })
  }
  out.push({
    id: "education/leadership-and-awards",
    kind: "education",
    title: "Leadership and awards",
    source: abs("/education.md"),
    page: abs("/#education"),
    text: [
      ...leadership.map((l) => `${l.title}, ${l.org} (${l.period}): ${l.highlight}`),
      ...accolades.map((a) => `${a.title}, ${a.org} (${a.period})${a.detail ? `: ${a.detail}` : ""}`),
    ].join(". "),
    keywords: ["leadership", "award", "hackathon", "volunteer", "council", "ieee"],
  })
  out.push({
    id: "skills",
    kind: "skills",
    title: "Technical skills",
    source: abs("/work.md"),
    page: abs("/#work"),
    text: skills.map((s) => `${s.label}: ${s.items.join(", ")}.`).join(" "),
    keywords: ["skills", "stack", "languages", "frameworks", "tools", "technologies"],
  })

  cachedPassages = out
  return out
}

// ---- Search: BM25 over passages, title and keywords weighted up ----

const STOP = new Set(
  "a an and are as at be by can did do does for from has have he her him his how i in is it its kartik kartik's me my of on or s so that the their them this to was what when where which who why with you your".split(
    " ",
  ),
)

function tokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9$%.+#]+/g) ?? [])
    .map((t) => t.replace(/^[.]+|[.]+$/g, ""))
    .filter((t) => t && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t))
}

interface Indexed {
  passage: Passage
  tf: Map<string, number>
  length: number
}

let index: { docs: Indexed[]; df: Map<string, number>; avg: number } | null = null

function buildIndex() {
  const docs = passages().map((passage) => {
    // Title and keywords count three times: they say what a passage is about.
    const bag = [
      ...tokens(passage.text),
      ...Array(3).fill(tokens(`${passage.title} ${(passage.keywords ?? []).join(" ")}`)).flat(),
    ]
    const tf = new Map<string, number>()
    for (const t of bag) tf.set(t, (tf.get(t) ?? 0) + 1)
    return { passage, tf, length: bag.length }
  })
  const df = new Map<string, number>()
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1)
  const avg = docs.reduce((s, d) => s + d.length, 0) / docs.length
  return { docs, df, avg }
}

export function search(query: string, opts: { limit?: number; kind?: string } = {}) {
  index ??= buildIndex()
  const { docs, df, avg } = index
  const q = [...new Set(tokens(query))]
  const k1 = 1.2
  const b = 0.75
  const N = docs.length
  return docs
    .filter((d) => !opts.kind || d.passage.kind === opts.kind)
    .map((d) => {
      let score = 0
      for (const t of q) {
        const f = d.tf.get(t)
        if (!f) continue
        const n = df.get(t) ?? 0
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5))
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.length) / avg)))
      }
      return { passage: d.passage, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(opts.limit ?? 5, 1), 20))
}
