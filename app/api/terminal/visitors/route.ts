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
    let countryCode = "Unknown"
    let zip = "Unknown"
    let lat = "Unknown"
    let lon = "Unknown"
    let isp = "Unknown"
    let org = "Unknown"
    let asn = "Unknown"
    
    try {
      // Only fetch location if it's not localhost
      if (ipAddress !== "Unknown" && ipAddress !== "::1" && !ipAddress.startsWith("127.") && !ipAddress.startsWith("192.168.")) {
        const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,regionName,city,zip,lat,lon,isp,org,as`)
        if (locationResponse.ok) {
          const locationData = await locationResponse.json()
          if (locationData.status === "success") {
            city = locationData.city || "Unknown"
            region = locationData.regionName || "Unknown"
            country = locationData.country || "Unknown"
            countryCode = locationData.countryCode || "Unknown"
            zip = locationData.zip || "Unknown"
            lat = locationData.lat !== undefined ? locationData.lat.toFixed(4) : "Unknown"
            lon = locationData.lon !== undefined ? locationData.lon.toFixed(4) : "Unknown"
            isp = locationData.isp || "Unknown"
            org = locationData.org || "Unknown"
            asn = locationData.as || "Unknown"
            location = zip !== "Unknown" ? `${city}, ${region} ${zip}, ${country}` : `${city}, ${region}, ${country}`
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
      location: location,
      city: city,
      region: region,
      country: country,
      countryCode: countryCode,
      zip: zip,
      lat: lat,
      lon: lon,
      isp: isp,
      org: org,
      asn: asn,
      
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
      
      timestamp: new Date().toLocaleString('en-US', { 
        timeZone: body.timezone || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to get visitor info" }, { status: 500 })
  }
}
