import { NextResponse } from "next/server"

const STATUS_URL = process.env.ARDUINO_STATUS_URL
const TOKEN = process.env.PI_STORAGE_TOKEN
const STATUS_TIMEOUT_MS = 2000

export async function GET() {
  if (!STATUS_URL) {
    return NextResponse.json({
      connected: false,
      error: "ARDUINO_STATUS_URL not set",
      logs: ["Set ARDUINO_STATUS_URL to the Arduino health endpoint"],
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS)

  try {
    const started = performance.now()
    const r = await fetch(STATUS_URL, { 
      signal: controller.signal, 
      cache: "no-store",
      headers: TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : undefined,
    })
    const latencyMs = Math.round(performance.now() - started)

    if (!r.ok) {
      const text = await r.text().catch(() => "")
      return NextResponse.json({ connected: false, error: text || r.statusText, latencyMs })
    }

    const data = await r.json().catch(() => ({}))
    clearTimeout(timer)
    return NextResponse.json({ connected: true, latencyMs, lastHeartbeat: new Date().toISOString(), logs: data.logs || [] })
  } catch (err: any) {
    clearTimeout(timer)
    return NextResponse.json({ connected: false, error: err?.name === "AbortError" ? "Timeout" : err?.message || "Unreachable" })
  }
}
