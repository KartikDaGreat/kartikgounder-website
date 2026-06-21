"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"

type GitHubData = {
  error?: string
  stats: { repos: number; stars: number }
  languages: Record<string, number>
  codeStats: {
    streak: number
    weeklyActivity: number[]
    mostActive: string
  }
}

const langColors: Record<string, string> = {
  Python: "bg-blue-500",
  TypeScript: "bg-sky-400",
  JavaScript: "bg-yellow-400",
  Java: "bg-orange-500",
  "C++": "bg-pink-500",
  Kotlin: "bg-purple-400",
  HTML: "bg-red-400",
  CSS: "bg-purple-300",
  Shell: "bg-green-400",
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null)

  useEffect(() => {
    fetch("/api/github/activity")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data || data.error) return null

  const topLangs = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const maxWeekly = Math.max(...(data.codeStats.weeklyActivity || []), 1)

  return (
    <div className="mt-6 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GitHub</span>
        </div>
        <a
          href="https://github.com/KartikDaGreat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          @KartikDaGreat
        </a>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm mb-3">
        <span>
          <span className="font-mono font-medium">{data.stats.repos}</span>
          <span className="text-muted-foreground ml-1">repos</span>
        </span>
        <span>
          <span className="font-mono font-medium">{data.stats.stars}</span>
          <span className="text-muted-foreground ml-1">stars</span>
        </span>
        {data.codeStats.streak > 0 && (
          <span>
            <span className="font-mono font-medium">{data.codeStats.streak}</span>
            <span className="text-muted-foreground ml-1">day streak</span>
          </span>
        )}
      </div>

      {/* Language bar */}
      {topLangs.length > 0 && (
        <div className="mb-3">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-secondary">
            {topLangs.map(([lang, pct]) => (
              <div
                key={lang}
                className={langColors[lang] || "bg-gray-500"}
                style={{ width: `${pct}%` }}
                title={`${lang}: ${pct}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
            {topLangs.map(([lang, pct]) => (
              <span key={lang} className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${langColors[lang] || "bg-gray-500"}`} />
                {lang} {pct}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly activity mini graph */}
      {data.codeStats.weeklyActivity && data.codeStats.weeklyActivity.length > 0 && (
        <div>
          <div className="text-[10px] text-muted-foreground mb-1">Last 12 weeks</div>
          <div className="flex gap-0.5">
            {data.codeStats.weeklyActivity.map((count, i) => {
              const intensity = count / maxWeekly
              return (
                <div
                  key={i}
                  className="h-3 flex-1 rounded-sm"
                  style={{
                    backgroundColor:
                      count === 0
                        ? "var(--secondary)"
                        : `rgba(52, 211, 153, ${0.2 + intensity * 0.8})`,
                  }}
                  title={`Week ${i + 1}: ${count} commits`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
