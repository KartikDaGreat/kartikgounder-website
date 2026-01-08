import { NextResponse } from "next/server"

export async function GET() {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  console.log("[Storage API] GET /files", { base, token: token ? "***" : "MISSING" })

  if (!base || !token) {
    const msg = "Missing PI_STORAGE_URL or PI_STORAGE_TOKEN"
    console.error("[Storage API]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  try {
    console.log(`[Storage API] Fetching ${base}/files`)
    const r = await fetch(`${base}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(`[Storage API] Response status: ${r.status}`)
    if (!r.ok) {
      const text = await r.text().catch(() => "")
      console.error(`[Storage API] Upstream error: ${text}`)
      return NextResponse.json({ error: text || r.statusText }, { status: r.status })
    }
    const data = await r.json()
    console.log(`[Storage API] Success: ${data.length} files`)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[Storage API] Fetch error:", err)
    return NextResponse.json({ error: err?.message || "Upstream error" }, { status: 502 })
  }
}
