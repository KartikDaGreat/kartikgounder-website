import { NextResponse } from "next/server"
import { z } from "zod"
import {
  getEntries,
  addEntry,
  removeEntry,
  removeEntryAdmin,
  filterEntries,
  getUser,
  type EntryCategory,
} from "@/lib/askos"
import { extractToken, verifyToken, verifyAdminKey } from "@/lib/askos-auth"

const SYSTEM_PROMPT = `You are reading the shared project context maintained by AI agents across a team. Every entry is a verified fact, decision, or status update contributed by a named teammate's agent.

BEFORE WORKING: Read all entries below to understand current project state, decisions, and conventions.
AFTER WORKING: Submit new decisions, conventions, or status changes via PUT so other agents stay informed.

Rules for contributing:
1. Only submit verified facts. Never speculation, opinions, or unconfirmed claims.
2. Use the correct category: decision, architecture, convention, blocker, status, context, or todo.
3. One entry = one atomic fact or decision. Keep entries self-contained and clear enough that an agent reading it months later understands without surrounding context.
4. If your entry replaces an older one, set "supersedes" to that entry's id so the history chain is preserved.
5. Never submit credentials, secrets, API keys, or personal data.
6. Tag entries with relevant project or component names (e.g. "auth", "frontend", "deploy").
7. Prefer concrete details over vague summaries. "Switched from REST to tRPC for type-safe API calls" beats "Updated API layer."

API usage:
- Read context: GET /api/askos
- Add entry: PUT /api/askos with Authorization: Bearer <token> and JSON body { "category": "decision", "content": "...", "tags": ["..."], "supersedes": "optional-id" }
- Remove your entry: DELETE /api/askos with Authorization: Bearer <token> and JSON body { "id": "..." }
- Filter: ?category=decision&tag=auth&limit=20&offset=0&author=Name&after=ISO-date&before=ISO-date`

const CATEGORIES: EntryCategory[] = [
  "decision",
  "architecture",
  "convention",
  "blocker",
  "status",
  "context",
  "todo",
]

const PutSchema = z.object({
  category: z.enum(CATEGORIES as [EntryCategory, ...EntryCategory[]]),
  content: z.string().min(1).max(2000),
  tags: z.array(z.string().max(50)).max(10).default([]),
  supersedes: z.string().optional(),
})

const DeleteSchema = z.object({
  id: z.string().min(1),
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders })
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const params = url.searchParams

    const filters = {
      limit: params.get("limit") ? Number(params.get("limit")) : undefined,
      offset: params.get("offset") ? Number(params.get("offset")) : undefined,
      author: params.get("author") ?? undefined,
      tag: params.get("tag") ?? undefined,
      category: (params.get("category") as EntryCategory) ?? undefined,
      after: params.get("after") ?? undefined,
      before: params.get("before") ?? undefined,
    }

    const entries = await getEntries()
    const { filtered, total } = filterEntries(entries, filters)

    const lastUpdated =
      entries.length > 0 ? entries[entries.length - 1].createdAt : null

    return NextResponse.json(
      {
        system: SYSTEM_PROMPT,
        entries: filtered,
        total,
        count: filtered.length,
        offset: filters.offset ?? 0,
        lastUpdated,
      },
      { headers: corsHeaders }
    )
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to retrieve context" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const token = extractToken(request)
    if (!token)
      return NextResponse.json(
        { error: "Missing Authorization header. Use: Bearer <token>" },
        { status: 401, headers: corsHeaders }
      )

    const payload = await verifyToken(token)
    if (!payload)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401, headers: corsHeaders }
      )

    const user = await getUser(payload.name)
    if (!user || !user.active)
      return NextResponse.json(
        { error: "User not found or deactivated" },
        { status: 403, headers: corsHeaders }
      )

    const body = await request.json()
    const parsed = PutSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400, headers: corsHeaders }
      )

    const { category, content, tags, supersedes } = parsed.data
    const entry = await addEntry(
      payload.name,
      category,
      content,
      tags,
      supersedes
    )

    return NextResponse.json({ entry }, { status: 201, headers: corsHeaders })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add entry" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const token = extractToken(request)
    if (!token)
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401, headers: corsHeaders }
      )

    const payload = await verifyToken(token)
    if (!payload)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401, headers: corsHeaders }
      )

    const body = await request.json()
    const parsed = DeleteSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400, headers: corsHeaders }
      )

    const isAdmin = verifyAdminKey(request)
    const result = isAdmin
      ? await removeEntryAdmin(parsed.data.id)
      : await removeEntry(parsed.data.id, payload.name)

    if (result === "not_found")
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404, headers: corsHeaders }
      )
    if (result === "forbidden")
      return NextResponse.json(
        { error: "You can only delete your own entries" },
        { status: 403, headers: corsHeaders }
      )

    return NextResponse.json(
      { ok: true },
      { headers: corsHeaders }
    )
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500, headers: corsHeaders }
    )
  }
}
