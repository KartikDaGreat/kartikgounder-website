import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Server-side headers
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const acceptLanguage = request.headers.get("accept-language") || "Unknown"
    const acceptEncoding = request.headers.get("accept-encoding") || "Unknown"
    const referer = request.headers.get("referer") || "Direct"

    // Extract browser info from user agent
    let browser = "Unknown"
    let platform = "Unknown"
    if (userAgent.includes("Windows")) platform = "Windows"
    else if (userAgent.includes("Mac")) platform = "macOS"
    else if (userAgent.includes("Linux")) platform = "Linux"
    else if (userAgent.includes("iPhone")) platform = "iOS (iPhone)"
    else if (userAgent.includes("iPad")) platform = "iOS (iPad)"
    else if (userAgent.includes("Android")) platform = "Android"

    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Edge")) browser = "Edge"

    return NextResponse.json({
      // Server-side collected
      ip: String(ip).split(",")[0],
      browser: browser,
      platform: platform,
      userAgent: userAgent,
      language: acceptLanguage.split(",")[0],
      acceptEncoding: acceptEncoding,
      referer: referer,
      
      // Client-side collected
      screenWidth: body.screenWidth,
      screenHeight: body.screenHeight,
      viewportWidth: body.viewportWidth,
      viewportHeight: body.viewportHeight,
      colorDepth: body.colorDepth,
      timezone: body.timezone,
      dnt: body.dnt,
      cookiesEnabled: body.cookiesEnabled,
      localStorageEnabled: body.localStorageEnabled,
      deviceMemory: body.deviceMemory,
      connectionType: body.connectionType,
      
      timestamp: new Date().toLocaleString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to get visitor info" }, { status: 500 })
  }
}
