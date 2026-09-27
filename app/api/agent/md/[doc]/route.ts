import { agentDoc, agentDocs } from "@/lib/agent"
import { markdown } from "@/lib/agent-http"

// Served at /<doc>.md through a rewrite in next.config.mjs.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return agentDocs().map((d) => ({ doc: d.id }))
}

export async function GET(_: Request, { params }: { params: Promise<{ doc: string }> }) {
  const doc = agentDoc((await params).doc)
  if (!doc) return new Response("Not found", { status: 404 })
  return markdown(doc.markdown)
}
