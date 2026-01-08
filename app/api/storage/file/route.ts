import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return NextResponse.json(
      { error: "Missing PI_STORAGE_URL or PI_STORAGE_TOKEN" },
      { status: 500 },
    )
  }

  const url = new URL(request.url)
  const name = url.searchParams.get("name")
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  try {
    const r = await fetch(`${base}/files/${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!r.ok) {
      const text = await r.text().catch(() => "")
      return NextResponse.json({ error: text || r.statusText }, { status: r.status })
    }

    const headers = new Headers(r.headers)
    // Force download if needed by preserving content-type; let browser handle it
    return new Response(r.body, { status: 200, headers })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upstream error" }, { status: 502 })
  }
}
