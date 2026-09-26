import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyAdminKey } from "@/lib/askos-auth"
import { signToken } from "@/lib/askos-auth"
import {
  getUsers,
  addUser,
  setUserActive,
  getEntries,
  removeEntryAdmin,
} from "@/lib/askos"

const ActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("generate_token"),
    name: z.string().min(1),
    expiresIn: z.string().default("90d"),
  }),
  z.object({
    action: z.literal("add_user"),
    name: z.string().min(1),
  }),
  z.object({
    action: z.literal("deactivate_user"),
    name: z.string().min(1),
  }),
  z.object({
    action: z.literal("activate_user"),
    name: z.string().min(1),
  }),
  z.object({
    action: z.literal("list_users"),
  }),
  z.object({
    action: z.literal("list_entries"),
  }),
  z.object({
    action: z.literal("delete_entry"),
    id: z.string().min(1),
  }),
])

export async function POST(request: Request) {
  try {
    if (!verifyAdminKey(request))
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 })

    const body = await request.json()
    const parsed = ActionSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid action", details: parsed.error.flatten() },
        { status: 400 }
      )

    const data = parsed.data

    switch (data.action) {
      case "generate_token": {
        const token = await signToken(data.name, data.expiresIn)
        return NextResponse.json({ token, name: data.name, expiresIn: data.expiresIn })
      }
      case "add_user": {
        const user = await addUser(data.name)
        return NextResponse.json({ user })
      }
      case "deactivate_user": {
        const ok = await setUserActive(data.name, false)
        if (!ok)
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        return NextResponse.json({ ok: true })
      }
      case "activate_user": {
        const ok = await setUserActive(data.name, true)
        if (!ok)
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        return NextResponse.json({ ok: true })
      }
      case "list_users": {
        const users = await getUsers()
        return NextResponse.json({ users })
      }
      case "list_entries": {
        const entries = await getEntries()
        return NextResponse.json({ entries })
      }
      case "delete_entry": {
        const result = await removeEntryAdmin(data.id)
        if (result === "not_found")
          return NextResponse.json({ error: "Entry not found" }, { status: 404 })
        return NextResponse.json({ ok: true })
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Admin action failed" },
      { status: 500 }
    )
  }
}
