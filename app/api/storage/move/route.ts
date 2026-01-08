import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return NextResponse.json({ error: "Missing storage config" }, { status: 500 })
  }

  try {
    const { from, to } = await request.json()

    if (!from || !to) {
      return NextResponse.json({ error: "From and to paths required" }, { status: 400 })
    }

    const r = await fetch(`${base}/move`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to }),
    })

    if (!r.ok) {
      const text = await r.text().catch(() => "")
      return NextResponse.json({ error: text || r.statusText }, { status: r.status })
    }

    return NextResponse.json({ success: true, message: `Moved ${from} to ${to}` })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Move failed" }, { status: 502 })
  }
}
