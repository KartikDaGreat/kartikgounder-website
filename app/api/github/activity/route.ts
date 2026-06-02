import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USER = "KartikDaGreat"
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

let cache: { data: any; ts: number } | null = null

async function ghFetch(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  }
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  const r = await fetch(`https://api.github.com${path}`, { headers, cache: "no-store" })
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${r.statusText}`)
  return r.json()
}

async function fetchActivity() {
  // Fetch repos sorted by push time
  const repos = await ghFetch(`/users/${GITHUB_USER}/repos?sort=pushed&per_page=20`)

  // Aggregate stats
  let totalStars = 0
  let totalSizeKB = 0
  const langMap: Record<string, number> = {}

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0
    totalSizeKB += repo.size || 0
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + (repo.size || 1)
    }
  }

  // Convert language sizes to percentages
  const langTotal = Object.values(langMap).reduce((a, b) => a + b, 0)
  const languages: Record<string, number> = {}
  for (const [lang, size] of Object.entries(langMap)) {
    languages[lang] = Math.round((size / langTotal) * 100)
  }

  // Fetch the 5 most recent commits from the most recently pushed repo
  const latestRepo = repos[0]
  let allCommits: { sha: string; message: string; repo: string; date: string }[] = []
  if (latestRepo) {
    try {
      const commits = await ghFetch(`/repos/${GITHUB_USER}/${latestRepo.name}/commits?per_page=5`)
      allCommits = commits.map((c: any) => ({
        sha: c.sha?.slice(0, 7),
        message: (c.commit?.message || "").split("\n")[0].slice(0, 80),
        repo: latestRepo.name,
        date: c.commit?.author?.date || c.commit?.committer?.date,
      }))
    } catch {}
  }

  // Fetch events for streak, weekly activity, commit time distribution
  let weeklyActivity: number[] = new Array(12).fill(0)
  let commitTimeDistribution: number[] = new Array(24).fill(0)
  let streak = 0
  let mostActive = repos[0]?.name || ""

  try {
    const events = await ghFetch(`/users/${GITHUB_USER}/events?per_page=100`)
    const pushEvents = events.filter((e: any) => e.type === "PushEvent")

    // Weekly activity (last 12 weeks)
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    for (const event of pushEvents) {
      const eventTime = new Date(event.created_at).getTime()
      const weeksAgo = Math.floor((now - eventTime) / weekMs)
      if (weeksAgo < 12) {
        weeklyActivity[11 - weeksAgo] += event.payload?.commits?.length || 1
      }
    }

    // Streak: consecutive days with push events
    const dayMs = 24 * 60 * 60 * 1000
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDays = new Set(
      pushEvents.map((e: any) => {
        const d = new Date(e.created_at)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    for (let i = 0; i < 90; i++) {
      const dayTs = today.getTime() - i * dayMs
      if (eventDays.has(dayTs)) {
        streak++
      } else if (i > 0) {
        break
      }
      // Allow today to not have events yet (skip day 0 if empty)
    }

    // Most active repo by recent commits
    const repoCommitCounts: Record<string, number> = {}
    for (const event of pushEvents) {
      const name = event.repo?.name?.split("/")[1] || ""
      repoCommitCounts[name] = (repoCommitCounts[name] || 0) + (event.payload?.commits?.length || 0)
    }
    const sorted = Object.entries(repoCommitCounts).sort((a, b) => b[1] - a[1])
    if (sorted.length > 0) mostActive = sorted[0][0]

    // Commit time distribution (24-hour buckets)
    for (const event of pushEvents) {
      const hour = new Date(event.created_at).getHours()
      commitTimeDistribution[hour] += event.payload?.commits?.length || 1
    }
  } catch {
    // Events API can fail; non-critical
  }

  return {
    commits: allCommits,
    languages,
    stats: { repos: repos.length, stars: totalStars },
    codeStats: {
      totalSizeKB,
      weeklyActivity,
      streak,
      mostActive,
      commitTimeDistribution,
    },
  }
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({
      error: "GitHub not configured",
      commits: [],
      languages: {},
      stats: { repos: 0, stars: 0 },
      codeStats: { totalSizeKB: 0, weeklyActivity: [], streak: 0, mostActive: "", commitTimeDistribution: [] },
    })
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const data = await fetchActivity()
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch GitHub data" },
      { status: 502 }
    )
  }
}
