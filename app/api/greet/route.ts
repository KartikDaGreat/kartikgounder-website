import { NextResponse, type NextRequest } from "next/server"

/**
 * Fire-and-forget notifier for the LED matrix on the Pi. A visitor landing on
 * the site lights up their city, region, country, and network organization on
 * the panel for a minute.
 *
 * Deliberately invisible: nothing about this is surfaced anywhere in the UI,
 * and the route always returns 200 so a sleeping Pi never affects the page.
 */

const PI_URL = process.env.PI_STORAGE_URL
const PI_TOKEN = process.env.PI_STORAGE_TOKEN

/** The panel can only render this charset, so trim to it before it leaves. */
const ALLOWED = /[^A-Z0-9 .,-]/g
const MAX_FIELD = 40

function clean(value: string | null | undefined): string {
  if (!value) return ""
  return value.toUpperCase().replace(ALLOWED, " ").replace(/\s+/g, " ").trim().slice(0, MAX_FIELD)
}

/**
 * Crawlers shouldn't flash a light in someone's apartment at 3am, and they
 * make up most of the traffic that would otherwise trigger this.
 */
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|fetch|monitor|curl|wget|headless|lighthouse|python-requests/i

function isBot(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") || ""
  return ua === "" || BOT_PATTERN.test(ua)
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || ""
}

/**
 * Vercel injects geo headers on every request at no cost, so location needs no
 * lookup. Organization is the only field that does.
 */
async function lookupOrg(ip: string): Promise<string> {
  if (!ip) return ""
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1500)
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,org,isp`, {
      cache: "no-store",
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!r.ok) return ""
    const data = await r.json()
    if (data.status !== "success") return ""
    return clean(data.org || data.isp)
  } catch {
    return ""
  }
}

export async function POST(request: NextRequest) {
  // Always 200. The caller is a fire-and-forget beacon on the landing path and
  // must never see a failure here, whatever went wrong downstream.
  const ok = NextResponse.json({ ok: true })

  if (!PI_URL || !PI_TOKEN) return ok
  if (isBot(request)) return ok

  try {
    const ip = clientIp(request)
    const payload = {
      city: clean(request.headers.get("x-vercel-ip-city")),
      region: clean(request.headers.get("x-vercel-ip-country-region")),
      country: clean(request.headers.get("x-vercel-ip-country")),
      org: await lookupOrg(ip),
      ts: new Date().toISOString(),
    }

    // Nothing to show. Skip rather than flash an empty panel.
    if (!payload.city && !payload.country && !payload.org) return ok

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)
    await fetch(`${PI_URL.replace(/\/$/, "")}/greet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PI_TOKEN}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    })
    clearTimeout(timer)
  } catch {
    // Pi asleep, offline, or slow. Not the visitor's problem.
  }

  return ok
}
