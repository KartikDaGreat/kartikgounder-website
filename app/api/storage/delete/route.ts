import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return NextResponse.json({ error: "Missing storage config" }, { status: 500 })
  }

  try {
    const { filename } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 })
    }

    const upstream = await fetch(`${base}/files/${encodeURIComponent(filename)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "")
      return NextResponse.json({ error: text || upstream.statusText }, { status: upstream.status })
    }

    return NextResponse.json({ success: true, message: `Deleted ${filename}` })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 502 })
  }
}
