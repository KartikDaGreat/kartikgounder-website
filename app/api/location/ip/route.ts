import { NextResponse, type NextRequest } from "next/server"

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || ""
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const isLocal = ip === "" || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.")
  const url = isLocal ? "http://ip-api.com/json" : `http://ip-api.com/json/${ip}`

  try {
    const r = await fetch(`${url}?fields=status,country,regionName,city,zip,lat,lon,query`, { cache: "no-store" })
    if (!r.ok) {
      return NextResponse.json({ error: "IP lookup failed" }, { status: 502 })
    }
    const data = await r.json()
    if (data.status !== "success") {
      return NextResponse.json({ error: "IP lookup failed" }, { status: 502 })
    }

    return NextResponse.json({
      ip: data.query,
      city: data.city || "Unknown",
      region: data.regionName || "Unknown",
      country: data.country || "Unknown",
      zip: data.zip || "Unknown",
      lat: typeof data.lat === "number" ? data.lat : null,
      lng: typeof data.lon === "number" ? data.lon : null,
      source: isLocal ? "server" : "ip",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "IP lookup failed" }, { status: 500 })
  }
}
