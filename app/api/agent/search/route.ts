import { type NextRequest } from "next/server"
import { passages, search } from "@/lib/agent"
import { json } from "@/lib/agent-http"

const KINDS = [...new Set(passages().map((p) => p.kind))]

/**
 * GET /api/agent/search?q=<question>&limit=5&kind=project
 *
 * Returns only the passages that answer the question, each with the markdown
 * document it came from, so an agent can pull the full context if it needs it.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const q = (params.get("q") ?? "").trim().slice(0, 300)
  const kind = params.get("kind") ?? undefined
  const limit = Number(params.get("limit") ?? 5) || 5

  if (!q) {
    return json({
      usage: "GET /api/agent/search?q=<question>&limit=1-20&kind=<kind>",
      kinds: KINDS,
      examples: [
        "/api/agent/search?q=what is he working on right now",
        "/api/agent/search?q=experience with MCP and LLM agents",
        "/api/agent/search?q=published papers&kind=publication",
      ],
      index: "/llms.txt",
    })
  }
  if (kind && !KINDS.includes(kind as (typeof KINDS)[number])) {
    return json({ error: `Unknown kind "${kind}". Use one of: ${KINDS.join(", ")}.` }, { status: 400 })
  }

  const results = search(q, { limit, kind })
  return json(
    {
      query: q,
      count: results.length,
      results: results.map(({ passage, score }) => ({
        title: passage.title,
        kind: passage.kind,
        score: Math.round(score * 100) / 100,
        text: passage.text,
        source: passage.source,
        page: passage.page,
      })),
      ...(results.length === 0 && {
        hint: "No passage matched. Try other words, or read /llms-full.txt for everything.",
      }),
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  )
}
