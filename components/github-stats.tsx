"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"
import { basics } from "@/lib/profile"

type GitHubCommit = {
  sha: string
  message: string
  repo: string
  date: string
}

type GitHubData = {
  error?: string
  commits: GitHubCommit[]
  stats: { repos: number; stars: number }
  languages: Record<string, number>
  codeStats: {
    streak: number
    weeklyActivity: number[]
    mostActive: string
  }
}

/** One accent, stepped down by rank, instead of a colour per language. */
const rankOpacity = ["opacity-100", "opacity-75", "opacity-55", "opacity-40", "opacity-25"]

const shellClass = "mb-12 min-h-52 p-4 rounded-xl border border-border bg-card"

function Header() {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Github aria-hidden className="size-4 text-muted-foreground" />
        <h2 className="eyebrow">GitHub</h2>
      </div>
      <a
        href={basics.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center min-h-11 text-xs text-primary hover:underline underline-offset-4"
      >
        @KartikDaGreat
      </a>
    </div>
  )
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch("/api/github/activity")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  if (failed || data?.error) return null

  // Reserve the card's space while loading so nothing below it jumps.
  if (!data) {
    return (
      <section className={shellClass} aria-busy="true">
        <Header />
      </section>
    )
  }

  const topLangs = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const weekly = data.codeStats.weeklyActivity ?? []
  const maxWeekly = Math.max(...weekly, 1)

  return (
    <section className={shellClass}>
      <Header />

      {/* Stats row */}
      <div className="flex gap-4 text-sm mb-3">
        <span>
          <span className="font-mono font-medium tabular-nums">{data.stats.repos}</span>
          <span className="text-muted-foreground ml-1">repos</span>
        </span>
        <span>
          <span className="font-mono font-medium tabular-nums">{data.stats.stars}</span>
          <span className="text-muted-foreground ml-1">stars</span>
        </span>
        {data.codeStats.streak > 0 && (
          <span>
            <span className="font-mono font-medium tabular-nums">{data.codeStats.streak}</span>
            <span className="text-muted-foreground ml-1">day streak</span>
          </span>
        )}
      </div>

      {/* Recent commits */}
      {data.commits && data.commits.length > 0 && (
        <div className="mb-3 space-y-1">
          <div className="text-xs text-muted-foreground mb-2">Recent commits</div>
          {data.commits.slice(0, 4).map((commit) => (
            /* min-w-0 on both: without it the un-wrapping message sets a
               min-content width that pushes the whole page wider than a phone. */
            <div key={commit.sha} className="flex items-start gap-2 text-xs font-mono min-w-0">
              <span className="text-muted-foreground flex-shrink-0">{commit.sha}</span>
              <span className="text-foreground/70 truncate min-w-0">{commit.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Language bar */}
      {topLangs.length > 0 && (
        <div className="mb-3">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-secondary">
            {topLangs.map(([lang, pct], i) => (
              <div
                key={lang}
                className={`bg-primary ${rankOpacity[i]}`}
                style={{ width: `${pct}%` }}
                title={`${lang}: ${pct}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {topLangs.map(([lang, pct], i) => (
              <span key={lang} className="text-xs text-muted-foreground flex items-center gap-1 tabular-nums">
                <span aria-hidden className={`size-1.5 rounded-full bg-primary ${rankOpacity[i]}`} />
                {lang} {pct}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly activity mini graph */}
      {weekly.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Last 12 weeks</div>
          <div
            role="img"
            aria-label={`Commits per week, last 12 weeks: ${weekly.join(", ")}`}
            className="flex gap-0.5"
          >
            {weekly.map((count, i) => (
              <div
                key={i}
                className="h-3 flex-1 rounded-sm"
                style={{
                  backgroundColor:
                    count === 0
                      ? "var(--secondary)"
                      : `color-mix(in oklch, var(--primary) ${20 + (count / maxWeekly) * 80}%, var(--secondary))`,
                }}
                title={`Week ${i + 1}: ${count} commits`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
