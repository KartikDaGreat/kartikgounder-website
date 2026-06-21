"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

// --- Types ---

type ArduinoStatus = {
  connected: boolean
  lastHeartbeat?: string
  latencyMs?: number
  logs?: string[]
  error?: string
}

type StorageStatus = {
  online: boolean
  fileCount: number
  latencyMs?: number
  lastSeen?: string
  error?: string
}

type GitHubData = {
  error?: string
  commits: { sha: string; message: string; repo: string; date: string }[]
  languages: Record<string, number>
  stats: { repos: number; stars: number }
  codeStats: {
    totalSizeKB: number
    weeklyActivity: number[]
    streak: number
    mostActive: string
    commitTimeDistribution: number[]
  }
}

type VercelData = {
  error?: string
  deploys: {
    id: string
    state: string
    createdAt: string | null
    buildDuration: number | null
    commit: { sha: string | null; message: string | null }
  }[]
  upSince: string | null
  successRate: number | null
  buildSizes: { sizeKB: number; date: string }[]
}

type WebVitals = {
  loadTime: number | null
  lcp: number | null
  cls: number | null
  transferKB: number | null
}

type DepsData = {
  error?: string
  totalDeps: number
  outdatedCount: number
  keyPackages: { name: string; installed: string; latest: string | null; upToDate: boolean | null }[]
  stack: { name: string; version: string }[]
}

type VisitorData = {
  total: number
  unique: number
  since: string
}

type ApiLatency = {
  endpoint: string
  history: number[] // last 20 measurements
}

// --- Helpers ---

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full",
        online ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
      )}
    />
  )
}

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

function MiniSparkline({ data, color = "emerald" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const h = 24
  const w = data.length * 6
  const points = data
    .map((v, i) => `${i * 6},${h - (v / max) * (h - 2)}`)
    .join(" ")

  const colorMap: Record<string, string> = {
    emerald: "stroke-emerald-400",
    sky: "stroke-sky-400",
    amber: "stroke-amber-400",
  }

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        className={colorMap[color] || "stroke-emerald-400"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// --- Hook: Hardware polling with latency tracking ---

function useHardwarePolling() {
  const [arduino, setArduino] = useState<ArduinoStatus>({ connected: false })
  const [storage, setStorage] = useState<StorageStatus>({ online: false, fileCount: 0 })
  const [apiLatencies, setApiLatencies] = useState<Record<string, number[]>>({
    arduino: [],
    storage: [],
  })

  useEffect(() => {
    let cancelled = false

    const addLatency = (key: string, ms: number) => {
      setApiLatencies((prev) => ({
        ...prev,
        [key]: [...prev[key].slice(-19), ms],
      }))
    }

    const poll = async () => {
      // Arduino
      try {
        const start = performance.now()
        const r = await fetch("/api/arduino/status", { cache: "no-store" })
        const ms = Math.round(performance.now() - start)
        const data = await r.json()
        if (!cancelled) {
          setArduino({ ...data, connected: Boolean(data.connected) })
          addLatency("arduino", ms)
        }
      } catch {
        if (!cancelled) setArduino((p) => ({ ...p, connected: false, error: "Unreachable" }))
      }

      // Storage
      try {
        const start = performance.now()
        const r = await fetch("/api/storage/files", { cache: "no-store" })
        const ms = Math.round(performance.now() - start)
        if (r.ok) {
          const files = await r.json()
          if (!cancelled) {
            setStorage({
              online: true,
              fileCount: Array.isArray(files) ? files.length : 0,
              latencyMs: ms,
              lastSeen: new Date().toISOString(),
            })
            addLatency("storage", ms)
          }
        } else {
          if (!cancelled) setStorage((p) => ({ ...p, online: false, error: `HTTP ${r.status}` }))
        }
      } catch (err: any) {
        if (!cancelled)
          setStorage((p) => ({ ...p, online: false, error: err?.message || "Unreachable" }))
      }
    }

    poll()
    const id = setInterval(poll, 5000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { arduino, storage, apiLatencies }
}

// --- Hook: GitHub data ---

function useGitHub() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/github/activity")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}

// --- Hook: Vercel data ---

function useVercel() {
  const [data, setData] = useState<VercelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/vercel/deploys")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}

// --- Hook: Web Vitals ---

function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitals>({
    loadTime: null,
    lcp: null,
    cls: null,
    transferKB: null,
  })

  useEffect(() => {
    setVitals((v) => ({ ...v, loadTime: Math.round(performance.now()) }))

    try {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const totalBytes = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
      setVitals((v) => ({ ...v, transferKB: Math.round(totalBytes / 1024) }))
    } catch {}

    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          setVitals((v) => ({ ...v, lcp: Math.round(entries[entries.length - 1].startTime) }))
        }
      })
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true })
    } catch {}

    try {
      let clsValue = 0
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          clsValue += (entry as any).value || 0
        }
        setVitals((v) => ({ ...v, cls: Math.round(clsValue * 1000) / 1000 }))
      })
      clsObs.observe({ type: "layout-shift", buffered: true })
    } catch {}
  }, [])

  return vitals
}

// --- Hook: Dependencies ---

function useDeps() {
  const [data, setData] = useState<DepsData | null>(null)

  useEffect(() => {
    fetch("/api/deps")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  return data
}

// --- Hook: Visitor count ---

function useVisitorCount() {
  const [data, setData] = useState<VisitorData | null>(null)
  const reported = useRef(false)

  useEffect(() => {
    // Report this visit
    if (!reported.current) {
      reported.current = true
      fetch("/api/visitors/count", { method: "POST" }).catch(() => {})
    }
    // Fetch count
    fetch("/api/visitors/count")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  return data
}

// --- Cards ---

function PiStorageCard({ storage }: { storage: StorageStatus }) {
  return (
    <CardShell title="Raspberry Pi Storage">
      <div className="flex items-center gap-2 text-sm">
        <StatusDot online={storage.online} />
        <span className={storage.online ? "text-emerald-300" : "text-rose-300"}>
          {storage.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        {typeof storage.latencyMs === "number" && (
          <div className="flex justify-between">
            <span>Latency</span>
            <span className="font-mono text-foreground">{storage.latencyMs} ms</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Files</span>
          <span className="font-mono text-foreground">{storage.fileCount}</span>
        </div>
        {storage.lastSeen && (
          <div className="flex justify-between">
            <span>Last seen</span>
            <span className="font-mono text-foreground">
              {new Date(storage.lastSeen).toLocaleTimeString()}
            </span>
          </div>
        )}
        {storage.error && <div className="text-rose-300/90">{storage.error}</div>}
      </div>
    </CardShell>
  )
}

function ArduinoCard({ arduino }: { arduino: ArduinoStatus }) {
  return (
    <CardShell title="Arduino">
      <div className="flex items-center gap-2 text-sm">
        <StatusDot online={arduino.connected} />
        <span className={arduino.connected ? "text-emerald-300" : "text-rose-300"}>
          {arduino.connected ? "Connected" : "Offline"}
        </span>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Last heartbeat</span>
          <span className="font-mono text-foreground">
            {arduino.lastHeartbeat ? new Date(arduino.lastHeartbeat).toLocaleTimeString() : "--"}
          </span>
        </div>
        {typeof arduino.latencyMs === "number" && (
          <div className="flex justify-between">
            <span>Latency</span>
            <span className="font-mono text-foreground">{arduino.latencyMs} ms</span>
          </div>
        )}
        {arduino.error && <div className="text-rose-300/90">{arduino.error}</div>}
      </div>
      {arduino.logs && arduino.logs.length > 0 && (
        <div className="rounded bg-background/50 border border-border/40 p-2 max-h-20 overflow-y-auto text-[11px] text-muted-foreground space-y-0.5">
          {arduino.logs.slice(0, 4).map((log, i) => (
            <div key={i} className="truncate font-mono">{log}</div>
          ))}
        </div>
      )}
    </CardShell>
  )
}

function GitHubActivityCard({ data }: { data: GitHubData | null }) {
  if (!data || data.error) {
    return (
      <CardShell title="GitHub Activity">
        <p className="text-xs text-muted-foreground">{data?.error || "GitHub not configured"}</p>
      </CardShell>
    )
  }

  const langColors: Record<string, string> = {
    Python: "bg-blue-500",
    TypeScript: "bg-sky-400",
    JavaScript: "bg-yellow-400",
    Java: "bg-orange-500",
    C: "bg-gray-400",
    "C++": "bg-pink-500",
    HTML: "bg-red-400",
    CSS: "bg-purple-400",
    Shell: "bg-green-400",
    Jupyter: "bg-orange-300",
    Rust: "bg-amber-600",
    Go: "bg-cyan-400",
  }

  return (
    <CardShell title="GitHub Activity">
      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground">{data.stats.repos}</span> repos
        </span>
        <span>
          <span className="font-mono text-foreground">{data.stats.stars}</span> stars
        </span>
      </div>

      {Object.keys(data.languages).length > 0 && (
        <div>
          <div className="flex h-2 rounded-full overflow-hidden bg-background/50">
            {Object.entries(data.languages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([lang, pct]) => (
                <div
                  key={lang}
                  className={cn("h-full", langColors[lang] || "bg-gray-500")}
                  style={{ width: `${pct}%` }}
                  title={`${lang}: ${pct}%`}
                />
              ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
            {Object.entries(data.languages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([lang, pct]) => (
                <span key={lang} className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full", langColors[lang] || "bg-gray-500")} />
                  {lang} {pct}%
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {data.commits.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="font-mono text-primary shrink-0">{c.sha}</span>
            <span className="text-foreground truncate flex-1">{c.message}</span>
            <span className="text-muted-foreground shrink-0 text-[10px]">
              {c.date ? relativeTime(c.date) : ""}
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function CodeStatsCard({ data }: { data: GitHubData | null }) {
  if (!data || data.error) {
    return (
      <CardShell title="Code Stats">
        <p className="text-xs text-muted-foreground">{data?.error || "GitHub not configured"}</p>
      </CardShell>
    )
  }

  const { codeStats } = data
  const maxWeekly = Math.max(...codeStats.weeklyActivity, 1)

  return (
    <CardShell title="Code Stats">
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Total size</span>
          <span className="font-mono text-foreground">
            {codeStats.totalSizeKB > 1024
              ? `${(codeStats.totalSizeKB / 1024).toFixed(1)} MB`
              : `${codeStats.totalSizeKB} KB`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Current streak</span>
          <span className="font-mono text-foreground">
            {codeStats.streak} day{codeStats.streak !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Most active</span>
          <span className="font-mono text-foreground truncate ml-2">
            {codeStats.mostActive || "--"}
          </span>
        </div>
      </div>

      {codeStats.weeklyActivity.length > 0 && (
        <div>
          <div className="text-[10px] text-muted-foreground mb-1">Last 12 weeks</div>
          <div className="flex gap-1">
            {codeStats.weeklyActivity.map((count, i) => {
              const intensity = count / maxWeekly
              return (
                <div
                  key={i}
                  className="h-4 flex-1 rounded-sm"
                  style={{
                    backgroundColor:
                      count === 0
                        ? "hsl(var(--muted) / 0.3)"
                        : `rgba(52, 211, 153, ${0.2 + intensity * 0.8})`,
                  }}
                  title={`Week ${i + 1}: ${count} commits`}
                />
              )
            })}
          </div>
        </div>
      )}
    </CardShell>
  )
}

function CommitTimeCard({ data }: { data: GitHubData | null }) {
  if (!data || data.error || !data.codeStats.commitTimeDistribution?.length) {
    return (
      <CardShell title="Commit Times">
        <p className="text-xs text-muted-foreground">{data?.error || "GitHub not configured"}</p>
      </CardShell>
    )
  }

  const dist = data.codeStats.commitTimeDistribution
  const max = Math.max(...dist, 1)

  // Find peak hour
  const peakHour = dist.indexOf(Math.max(...dist))
  const formatHour = (h: number) => {
    if (h === 0) return "12am"
    if (h === 12) return "12pm"
    return h < 12 ? `${h}am` : `${h - 12}pm`
  }

  return (
    <CardShell title="Commit Times">
      <div className="text-xs text-muted-foreground mb-1">
        Peak hour: <span className="font-mono text-foreground">{formatHour(peakHour)}</span>
      </div>
      <div className="flex items-end gap-px h-10">
        {dist.map((count, hour) => {
          const height = count > 0 ? Math.max(2, (count / max) * 40) : 1
          return (
            <div
              key={hour}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${height}px`,
                backgroundColor:
                  count === 0
                    ? "hsl(var(--muted) / 0.2)"
                    : hour === peakHour
                      ? "rgb(52, 211, 153)"
                      : `rgba(52, 211, 153, ${0.3 + (count / max) * 0.5})`,
              }}
              title={`${formatHour(hour)}: ${count} commits`}
            />
          )
        })}
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </CardShell>
  )
}

function WebPerformanceCard({ vitals }: { vitals: WebVitals }) {
  const lcpColor =
    vitals.lcp === null
      ? "text-muted-foreground"
      : vitals.lcp < 2500
        ? "text-emerald-300"
        : vitals.lcp < 4000
          ? "text-amber-300"
          : "text-rose-300"

  const clsColor =
    vitals.cls === null
      ? "text-muted-foreground"
      : vitals.cls < 0.1
        ? "text-emerald-300"
        : vitals.cls < 0.25
          ? "text-amber-300"
          : "text-rose-300"

  return (
    <CardShell title="Website Performance">
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Page load</span>
          <span className="font-mono text-foreground">
            {vitals.loadTime !== null ? `${(vitals.loadTime / 1000).toFixed(2)}s` : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP</span>
          <span className={cn("font-mono", lcpColor)}>
            {vitals.lcp !== null ? `${(vitals.lcp / 1000).toFixed(2)}s` : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS</span>
          <span className={cn("font-mono", clsColor)}>
            {vitals.cls !== null ? vitals.cls.toFixed(3) : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Transfer size</span>
          <span className="font-mono text-foreground">
            {vitals.transferKB !== null
              ? vitals.transferKB > 1024
                ? `${(vitals.transferKB / 1024).toFixed(1)} MB`
                : `${vitals.transferKB} KB`
              : "--"}
          </span>
        </div>
      </div>
    </CardShell>
  )
}

function DeployCard({ data }: { data: VercelData | null }) {
  if (!data || data.error) {
    return (
      <CardShell title="Deploy & Uptime">
        <p className="text-xs text-muted-foreground">{data?.error || "Deploy info not configured"}</p>
      </CardShell>
    )
  }

  const stateColors: Record<string, string> = {
    READY: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
    ERROR: "bg-rose-400/20 text-rose-300 border-rose-400/40",
    BUILDING: "bg-amber-400/20 text-amber-300 border-amber-400/40",
    QUEUED: "bg-blue-400/20 text-blue-300 border-blue-400/40",
    CANCELED: "bg-gray-400/20 text-gray-300 border-gray-400/40",
  }

  return (
    <CardShell title="Deploy & Uptime">
      <div className="flex gap-4 text-xs text-muted-foreground">
        {data.upSince && (
          <span>
            Up since <span className="font-mono text-foreground">{relativeTime(data.upSince)}</span>
          </span>
        )}
        {data.successRate !== null && (
          <span>
            Success rate{" "}
            <span
              className={cn(
                "font-mono",
                data.successRate >= 90 ? "text-emerald-300" : data.successRate >= 70 ? "text-amber-300" : "text-rose-300"
              )}
            >
              {data.successRate}%
            </span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        {data.deploys.slice(0, 3).map((d, i) => (
          <div
            key={d.id}
            className={cn(
              "rounded border border-border/40 p-2 text-xs space-y-1",
              i === 0 && "bg-background/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] border",
                  stateColors[d.state] || "bg-gray-400/20 text-gray-300 border-gray-400/40"
                )}
              >
                {d.state}
              </span>
              {d.createdAt && (
                <span className="text-muted-foreground text-[10px]">{relativeTime(d.createdAt)}</span>
              )}
            </div>
            {d.commit.message && (
              <div className="text-foreground truncate">
                {d.commit.sha && <span className="font-mono text-primary mr-1.5">{d.commit.sha}</span>}
                {d.commit.message}
              </div>
            )}
            {d.buildDuration !== null && (
              <div className="text-muted-foreground">Build: {d.buildDuration}s</div>
            )}
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function BuildSizeCard({ data }: { data: VercelData | null }) {
  if (!data || data.error || !data.buildSizes?.length) {
    return (
      <CardShell title="Build Size Trend">
        <p className="text-xs text-muted-foreground">{data?.error || "No build size data"}</p>
      </CardShell>
    )
  }

  const sizes = data.buildSizes
  const latest = sizes[sizes.length - 1]
  const prev = sizes.length >= 2 ? sizes[sizes.length - 2] : null
  const delta = prev ? latest.sizeKB - prev.sizeKB : 0
  const max = Math.max(...sizes.map((s) => s.sizeKB), 1)

  return (
    <CardShell title="Build Size Trend">
      <div className="flex items-baseline gap-2 text-xs">
        <span className="font-mono text-foreground text-sm">
          {latest.sizeKB > 1024
            ? `${(latest.sizeKB / 1024).toFixed(1)} MB`
            : `${latest.sizeKB} KB`}
        </span>
        {delta !== 0 && (
          <span
            className={cn(
              "font-mono text-[10px]",
              delta > 0 ? "text-rose-300" : "text-emerald-300"
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta > 1024 ? `${(delta / 1024).toFixed(1)} MB` : `${delta} KB`}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1 h-8">
        {sizes.map((s, i) => {
          const height = Math.max(2, (s.sizeKB / max) * 32)
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-sky-400/50"
              style={{ height: `${height}px` }}
              title={`${s.sizeKB > 1024 ? `${(s.sizeKB / 1024).toFixed(1)} MB` : `${s.sizeKB} KB`}`}
            />
          )
        })}
      </div>
      <div className="text-[10px] text-muted-foreground">
        Last {sizes.length} deploys
      </div>
    </CardShell>
  )
}

function ApiHealthCard({ latencies }: { latencies: Record<string, number[]> }) {
  const endpoints = Object.entries(latencies).filter(([, hist]) => hist.length > 0)

  return (
    <CardShell title="API Health">
      {endpoints.length === 0 ? (
        <p className="text-xs text-muted-foreground">Collecting data...</p>
      ) : (
        <div className="space-y-3">
          {endpoints.map(([name, history]) => {
            const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length)
            const latest = history[history.length - 1]
            return (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">/api/{name}</span>
                  <span className="font-mono text-foreground">{latest} ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <MiniSparkline data={history} />
                  <span className="text-[10px] text-muted-foreground">avg {avg}ms</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </CardShell>
  )
}

function DepsCard({ data }: { data: DepsData | null }) {
  if (!data || data.error) {
    return (
      <CardShell title="Dependencies">
        <p className="text-xs text-muted-foreground">{data?.error || "Loading..."}</p>
      </CardShell>
    )
  }

  return (
    <CardShell title="Dependencies">
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground">{data.totalDeps}</span> total
        </span>
        <span>
          <span
            className={cn(
              "font-mono",
              data.outdatedCount === 0 ? "text-emerald-300" : "text-amber-300"
            )}
          >
            {data.outdatedCount}
          </span>{" "}
          outdated
        </span>
      </div>

      <div className="space-y-1">
        {data.keyPackages.map((pkg) => (
          <div key={pkg.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{pkg.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground">{pkg.installed}</span>
              {pkg.upToDate === false && pkg.latest && (
                <span className="font-mono text-amber-300 text-[10px]">{pkg.latest}</span>
              )}
              {pkg.upToDate === true && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
              {pkg.upToDate === false && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function TechStackCard({ data }: { data: DepsData | null }) {
  if (!data) {
    return (
      <CardShell title="Tech Stack">
        <p className="text-xs text-muted-foreground">Loading...</p>
      </CardShell>
    )
  }

  const infra = [
    { name: "Vercel", detail: "Edge Network" },
    { name: "Raspberry Pi", detail: "File Storage" },
    { name: "Arduino", detail: "IoT Sensor" },
  ]

  return (
    <CardShell title="Tech Stack">
      <div className="space-y-1">
        {data.stack.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{item.name}</span>
            <span className="font-mono text-muted-foreground">{item.version || "--"}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 pt-2 space-y-1">
        {infra.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{item.name}</span>
            <span className="text-muted-foreground text-[10px]">{item.detail}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function VisitorCard({ data }: { data: VisitorData | null }) {
  if (!data) {
    return (
      <CardShell title="Visitors">
        <p className="text-xs text-muted-foreground">Collecting...</p>
      </CardShell>
    )
  }

  return (
    <CardShell title="Visitors">
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground text-sm">{data.total}</span> views
        </span>
        <span>
          <span className="font-mono text-foreground text-sm">{data.unique}</span> unique
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground">
        Since deploy {relativeTime(data.since)}
      </div>
    </CardShell>
  )
}

// --- Main Component ---

export function SystemsSection() {
  const { arduino, storage, apiLatencies } = useHardwarePolling()
  const { data: githubData } = useGitHub()
  const { data: vercelData } = useVercel()
  const vitals = useWebVitals()
  const depsData = useDeps()
  const visitorData = useVisitorCount()

  return (
    <section>
      <h2 className="text-2xl font-bold mb-1">Systems</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Live infrastructure dashboard: hardware, code, and deployments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1: Hardware */}
        <PiStorageCard storage={storage} />
        <ArduinoCard arduino={arduino} />

        {/* Row 2: GitHub */}
        <GitHubActivityCard data={githubData} />
        <CodeStatsCard data={githubData} />

        {/* Row 3: Commit Times & API Health */}
        <CommitTimeCard data={githubData} />
        <ApiHealthCard latencies={apiLatencies} />

        {/* Row 4: Website & Deploys */}
        <WebPerformanceCard vitals={vitals} />
        <DeployCard data={vercelData} />

        {/* Row 5: Build Size & Dependencies */}
        <BuildSizeCard data={vercelData} />
        <DepsCard data={depsData} />

        {/* Row 6: Tech Stack & Visitors */}
        <TechStackCard data={depsData} />
        <VisitorCard data={visitorData} />
      </div>
    </section>
  )
}
