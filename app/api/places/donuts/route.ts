import { NextResponse, type NextRequest } from "next/server"

const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API
const DEFAULT_RADIUS_METERS = 5000
const RESULT_LIMIT = 6

export async function GET(request: NextRequest) {
  if (!GOOGLE_MAPS_API) {
    return NextResponse.json({ error: "GOOGLE_MAPS_API not set" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid location" }, { status: 400 })
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
  url.searchParams.set("location", `${lat},${lng}`)
  url.searchParams.set("radius", String(DEFAULT_RADIUS_METERS))
  url.searchParams.set("keyword", "donut")
  url.searchParams.set("type", "bakery")
  url.searchParams.set("key", GOOGLE_MAPS_API)

  try {
    const r = await fetch(url.toString(), { cache: "no-store" })
    if (!r.ok) {
      return NextResponse.json({ error: `Places lookup failed (HTTP ${r.status})` }, { status: 502 })
    }

    const data = await r.json()
    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: data.error_message || "Places lookup failed" }, { status: 502 })
    }

    const places = Array.isArray(data.results)
      ? data.results.slice(0, RESULT_LIMIT).map((place: any) => ({
          name: place.name,
          address: place.vicinity,
          placeId: place.place_id,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
        }))
      : []

    return NextResponse.json({ places })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Places lookup failed" }, { status: 500 })
  }
}
