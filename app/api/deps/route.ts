import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes
let cache: { data: any; ts: number } | null = null

const KEY_PACKAGES = ["next", "react", "tailwindcss", "typescript", "lucide-react"]

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const pkgPath = join(process.cwd(), "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))

    const deps = Object.keys(pkg.dependencies || {})
    const devDeps = Object.keys(pkg.devDependencies || {})
    const totalDeps = deps.length + devDeps.length

    // Check key packages against npm registry
    const checks = await Promise.all(
      KEY_PACKAGES.map(async (name) => {
        const installed =
          pkg.dependencies?.[name] || pkg.devDependencies?.[name] || null
        if (!installed) return null

        try {
          const r = await fetch(`https://registry.npmjs.org/${name}/latest`, {
            cache: "no-store",
          })
          if (!r.ok) return { name, installed, latest: null, upToDate: null }
          const data = await r.json()
          const latest = data.version || null
          // Strip ^ ~ >= etc for comparison
          const clean = installed.replace(/^[\^~>=<]+/, "")
          return { name, installed: clean, latest, upToDate: clean === latest }
        } catch {
          return { name, installed: installed.replace(/^[\^~>=<]+/, ""), latest: null, upToDate: null }
        }
      })
    )

    const keyPackages = checks.filter(Boolean)
    const outdatedCount = keyPackages.filter((p) => p && p.upToDate === false).length

    // Tech stack with versions
    const stack = [
      { name: "Next.js", version: (pkg.dependencies?.next || "").replace(/^[\^~>=<]+/, "") },
      { name: "React", version: (pkg.dependencies?.react || "").replace(/^[\^~>=<]+/, "") },
      { name: "TypeScript", version: (pkg.devDependencies?.typescript || "").replace(/^[\^~>=<]+/, "") },
      { name: "Tailwind CSS", version: (pkg.devDependencies?.tailwindcss || pkg.dependencies?.tailwindcss || "").replace(/^[\^~>=<]+/, "") },
    ]

    const data = {
      totalDeps,
      outdatedCount,
      keyPackages,
      stack,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to read dependencies" },
      { status: 500 }
    )
  }
}
