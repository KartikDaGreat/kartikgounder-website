/** Shared response helpers for the agent-facing routes. */

const CORS = { "Access-Control-Allow-Origin": "*" }

export function markdown(body: string, type = "text/markdown"): Response {
  return new Response(body, {
    headers: {
      "Content-Type": `${type}; charset=utf-8`,
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
      ...CORS,
    },
  })
}

export function json(body: unknown, init: ResponseInit = {}): Response {
  return Response.json(body, { ...init, headers: { ...CORS, ...init.headers } })
}
