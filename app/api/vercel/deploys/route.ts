import { NextResponse } from "next/server"

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const PROJECT_ID = process.env.VERCEL_PROJECT_ID
const CACHE_TTL = 5 * 60 * 1000

let cache: { data: any; ts: number } | null = null

export async function GET() {
  if (!VERCEL_TOKEN || !PROJECT_ID) {
    return NextResponse.json({
      error: "Deploy info not configured",
      deploys: [],
      upSince: null,
    })
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const r = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=10`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        cache: "no-store",
      }
    )

    if (!r.ok) {
      const text = await r.text().catch(() => "")
      return NextResponse.json({ error: text || r.statusText }, { status: r.status })
    }

    const json = await r.json()
    const deployments = (json.deployments || []).slice(0, 10)

    const deploys = deployments.map((d: any) => ({
      id: d.uid,
      state: d.state || d.readyState,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      buildDuration: d.buildingAt && d.ready
        ? Math.round((d.ready - d.buildingAt) / 1000)
        : null,
      commit: {
        sha: d.meta?.githubCommitSha?.slice(0, 7) || null,
        message: d.meta?.githubCommitMessage?.split("\n")[0]?.slice(0, 80) || null,
      },
    }))

    const readyDeploy = deployments.find(
      (d: any) => (d.state || d.readyState) === "READY"
    )
    const upSince = readyDeploy?.createdAt
      ? new Date(readyDeploy.createdAt).toISOString()
      : null

    // Success rate from last 10 deploys
    const total = deployments.length
    const ready = deployments.filter(
      (d: any) => (d.state || d.readyState) === "READY"
    ).length
    const successRate = total > 0 ? Math.round((ready / total) * 100) : null

    // Build size trend (last 10 deploy sizes in KB, if available)
    const buildSizes = deployments
      .map((d: any) => ({
        sizeKB: d.size ? Math.round(d.size / 1024) : null,
        date: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      }))
      .filter((s: any) => s.sizeKB !== null)
      .reverse()

    const data = { deploys, upSince, successRate, buildSizes }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch deploy data" },
      { status: 502 }
    )
  }
}
