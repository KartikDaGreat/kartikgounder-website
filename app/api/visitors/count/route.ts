import { NextResponse, type NextRequest } from "next/server"

const deployTime = new Date().toISOString()
let visitCount = 0
const seenVisitors = new Set<string>()

export async function GET() {
  return NextResponse.json({
    total: visitCount,
    unique: seenVisitors.size,
    since: deployTime,
  })
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  // Hash the IP so we don't store it raw
  const hash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + deployTime))
    )
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16)

  visitCount++
  seenVisitors.add(hash)

  return NextResponse.json({ ok: true })
}
