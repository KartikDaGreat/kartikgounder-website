export async function POST(request: Request) {
  const base = process.env.PI_STORAGE_URL
  const token = process.env.PI_STORAGE_TOKEN

  if (!base || !token) {
    return new Response(
      JSON.stringify({ error: "Missing PI_STORAGE_URL or PI_STORAGE_TOKEN" }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }

  try {
    const form = await request.formData()
    const file = form.get("file") as unknown as File | null
    if (!file) {
      return new Response(JSON.stringify({ error: "file is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const upstreamForm = new FormData()
    // @ts-ignore - Node fetch File type supports name
    upstreamForm.append("file", file, (file as any).name || "upload.bin")

    // Forward the request to the Raspberry Pi and stream the response
    const r = await fetch(`${base}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upstreamForm,
    })

    // Stream the response directly without buffering
    return new Response(r.body, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") || "text/event-stream",
        "cache-control": "no-cache",
        "connection": "keep-alive",
      },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Upstream error" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    })
  }
}
