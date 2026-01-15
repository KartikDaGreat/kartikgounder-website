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

    // Fetch location data from ip-api.com
    const ipAddress = String(ip).split(",")[0]
    let location = "Unknown"
    let city = "Unknown"
    let region = "Unknown"
    let country = "Unknown"
    let isp = "Unknown"
    
    try {
      // Only fetch location if it's not localhost
      if (ipAddress !== "Unknown" && ipAddress !== "::1" && !ipAddress.startsWith("127.") && !ipAddress.startsWith("192.168.")) {
        const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city,isp`)
        if (locationResponse.ok) {
          const locationData = await locationResponse.json()
          if (locationData.status === "success") {
            city = locationData.city || "Unknown"
            region = locationData.regionName || "Unknown"
            country = locationData.country || "Unknown"
            isp = locationData.isp || "Unknown"
            location = `${city}, ${region}, ${country}`
          }
        }
      } else {
        location = "Localhost"
        country = "Local"
      }
    } catch (error) {
      // Silently fail if location API is unavailable
      console.error("Location fetch error:", error)
    }

    return NextResponse.json({
      // Server-side collected
      ip: ipAddress,
      browser: browser,
      platform: platform,
      userAgent: userAgent,
      language: acceptLanguage.split(",")[0],
      acceptEncoding: acceptEncoding,
      referer: referer,
      location: location,
      city: city,
      region: region,
      country: country,
      isp: isp,
      
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
