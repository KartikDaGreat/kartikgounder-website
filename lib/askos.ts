import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const USERS_KEY = "askos:users"
const ENTRIES_KEY = "askos:entries"

export type EntryCategory =
  | "decision"
  | "architecture"
  | "convention"
  | "blocker"
  | "status"
  | "context"
  | "todo"

export interface AskosUser {
  name: string
  createdAt: string
  active: boolean
}

export interface AskosEntry {
  id: string
  author: string
  category: EntryCategory
  content: string
  tags: string[]
  supersedes?: string
  supersededBy?: string
  createdAt: string
}

function generateId(): string {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

// --- Users ---

export async function getUsers(): Promise<AskosUser[]> {
  return (await redis.get<AskosUser[]>(USERS_KEY)) ?? []
}

export async function getUser(name: string): Promise<AskosUser | undefined> {
  const users = await getUsers()
  return users.find((u) => u.name === name)
}

export async function addUser(name: string): Promise<AskosUser> {
  const users = await getUsers()
  const existing = users.find((u) => u.name === name)
  if (existing) return existing
  const user: AskosUser = { name, createdAt: new Date().toISOString(), active: true }
  users.push(user)
  await redis.set(USERS_KEY, users)
  return user
}

export async function setUserActive(
  name: string,
  active: boolean
): Promise<boolean> {
  const users = await getUsers()
  const user = users.find((u) => u.name === name)
  if (!user) return false
  user.active = active
  await redis.set(USERS_KEY, users)
  return true
}

// --- Entries ---

export async function getEntries(): Promise<AskosEntry[]> {
  return (await redis.get<AskosEntry[]>(ENTRIES_KEY)) ?? []
}

export async function addEntry(
  author: string,
  category: EntryCategory,
  content: string,
  tags: string[],
  supersedes?: string
): Promise<AskosEntry> {
  const entries = await getEntries()
  const entry: AskosEntry = {
    id: generateId(),
    author,
    category,
    content,
    tags,
    createdAt: new Date().toISOString(),
  }
  if (supersedes) {
    entry.supersedes = supersedes
    const old = entries.find((e) => e.id === supersedes)
    if (old) old.supersededBy = entry.id
  }
  entries.push(entry)
  await redis.set(ENTRIES_KEY, entries)
  return entry
}

export async function removeEntry(
  id: string,
  author: string
): Promise<"ok" | "not_found" | "forbidden"> {
  const entries = await getEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return "not_found"
  if (entries[idx].author !== author) return "forbidden"
  entries.splice(idx, 1)
  await redis.set(ENTRIES_KEY, entries)
  return "ok"
}

export async function removeEntryAdmin(
  id: string
): Promise<"ok" | "not_found"> {
  const entries = await getEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return "not_found"
  entries.splice(idx, 1)
  await redis.set(ENTRIES_KEY, entries)
  return "ok"
}

export interface EntryFilter {
  limit?: number
  offset?: number
  author?: string
  tag?: string
  category?: EntryCategory
  after?: string
  before?: string
}

export function filterEntries(
  entries: AskosEntry[],
  filters: EntryFilter
): { filtered: AskosEntry[]; total: number } {
  let result = entries.slice().reverse() // newest first

  if (filters.author)
    result = result.filter((e) => e.author === filters.author)
  if (filters.tag)
    result = result.filter((e) => e.tags.includes(filters.tag!))
  if (filters.category)
    result = result.filter((e) => e.category === filters.category)
  if (filters.after)
    result = result.filter((e) => e.createdAt > filters.after!)
  if (filters.before)
    result = result.filter((e) => e.createdAt < filters.before!)

  const total = result.length
  const offset = filters.offset ?? 0
  const limit = filters.limit ?? result.length
  result = result.slice(offset, offset + limit)

  return { filtered: result, total }
}
