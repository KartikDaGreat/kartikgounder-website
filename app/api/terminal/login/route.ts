import { NextResponse, type NextRequest } from "next/server"

// Simple password check. Set TERMINAL_PASSWORD in your env; falls back to admin123.
const PASSWORD = process.env.TERMINAL_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    if (password === PASSWORD) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Login failed" }, { status: 500 })
  }
}
