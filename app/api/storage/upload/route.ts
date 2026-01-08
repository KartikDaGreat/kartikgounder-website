import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return NextResponse.json(
      { error: "Missing PI_STORAGE_URL or PI_STORAGE_TOKEN" },
      { status: 500 },
    )
  }

  try {
    const form = await request.formData()
    const file = form.get("file") as unknown as File | null
    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 })
    }

    const upstreamForm = new FormData()
    // @ts-ignore - Node fetch File type supports name
    upstreamForm.append("file", file, (file as any).name || "upload.bin")

    const r = await fetch(`${base}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upstreamForm,
    })
    const text = await r.text()
    const contentType = r.headers.get("content-type") || "application/json"
    return new Response(text, { status: r.status, headers: { "content-type": contentType } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upstream error" }, { status: 502 })
  }
}
