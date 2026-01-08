import { NextResponse } from "next/server"

export async function GET() {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return NextResponse.json(
      { error: "Missing PI_STORAGE_URL or PI_STORAGE_TOKEN" },
      { status: 500 },
    )
  }

  try {
    const r = await fetch(`${base}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!r.ok) {
      const text = await r.text().catch(() => "")
      return NextResponse.json({ error: text || r.statusText }, { status: r.status })
    }
    const data = await r.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upstream error" }, { status: 502 })
  }
}
