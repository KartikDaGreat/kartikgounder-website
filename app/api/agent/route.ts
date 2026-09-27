import { agentDocs } from "@/lib/agent"
import { json } from "@/lib/agent-http"
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
  skills,
} from "@/lib/profile"
import { projects } from "@/lib/projects"

export const dynamic = "force-static"

/** The whole profile as structured JSON, for agents that prefer data to prose. */
export function GET() {
  return json({
    basics,
    now,
    headlineResults: proof,
    experience: experiences.map(({ impact, ...e }) => ({
      ...e,
      impact: impact?.map(({ value, label }) => ({ value, label })),
    })),
    projects: projects.map((p) => ({
      title: p.title,
      slug: p.slug,
      featured: !!p.featured,
      year: p.year,
      description: p.description,
      role: p.role,
      status: p.status,
      technologies: p.technologies,
      tags: p.tags,
      metrics: p.metrics,
      links: { demo: p.demo, demos: p.demos, github: p.github, paper: p.paper, video: p.video },
      page: `${SITE_URL}/projects/${p.slug}`,
      markdown: `${SITE_URL}/projects/${p.slug}.md`,
    })),
    publications,
    patents,
    education: degrees,
    certifications: certifications.map((c) => ({ ...c, file: `${SITE_URL}${c.file}` })),
    leadership,
    awards: accolades,
    skills,
    documents: agentDocs().map(({ id, title, path, description }) => ({
      id,
      title,
      description,
      url: `${SITE_URL}${path}`,
    })),
  })
}
