import { projectMarkdown } from "@/lib/agent"
import { markdown } from "@/lib/agent-http"
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects"

// Served at /projects/<slug>.md through a rewrite in next.config.mjs.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const project = getProjectBySlug((await params).slug)
  if (!project) return new Response("Not found", { status: 404 })
  return markdown(projectMarkdown(project))
}
