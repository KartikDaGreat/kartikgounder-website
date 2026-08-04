"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, FileText, Github, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { projects, type Project } from "@/lib/projects"
import { Art } from "@/components/art"
import { Reveal, StaggerItem, StaggerRoot } from "@/components/motion/reveal"

type Filter = "all" | "swe" | "ml"

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "swe", label: "Software" },
  { id: "ml", label: "ML / AI" },
]

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all")

  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const visible = filter === "all" ? rest : rest.filter((p) => p.category.includes(filter))

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground max-w-2xl">
          Thirteen builds, from trust middleware for AI coding agents to smart glasses held together with
          3D-printed parts. Three shipped as peer-reviewed papers. Each page tells the story: the problem,
          the decisions, and what I'd do differently.
        </p>
      </div>

      {/* Featured projects */}
      <div className="mb-14">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Flagship builds</h2>
        <StaggerRoot className="space-y-4" stagger={0.08}>
          {featured.map((project, i) => (
            <StaggerItem key={project.slug}>
              <FeaturedCard project={project} index={i} />
            </StaggerItem>
          ))}
        </StaggerRoot>
      </div>

      {/* All other projects */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">The rest of the shelf</h2>
          <div className="flex items-center gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  filter === f.id
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((project) => (
            <Reveal key={project.slug}>
              <CompactCard project={project} />
            </Reveal>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Nothing in this bucket.</p>
        )}
      </div>
    </section>
  )
}

// The departure board has dedicated art; other hardware builds share the
// hardware illustration, and everything else splits on the ml tag.
const HARDWARE_SLUGS = new Set(["traffic-speed-detection-system"])

function artFor(project: Project): string {
  if (project.slug === "departure-board") return "/art/project-departure-board.png"
  if (HARDWARE_SLUGS.has(project.slug)) return "/art/cat-hardware.png"
  if (project.category.includes("ml")) return "/art/cat-ml.png"
  return "/art/cat-systems.png"
}

/** Faint category illustration bleeding off the card's right edge. */
function CardArt({ project }: { project: Project }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-2/5 [mask-image:linear-gradient(to_left,black,transparent)]"
    >
      <Art src={artFor(project)} alt="" width={1408} height={768} cover weight="texture" className="h-full w-full" />
    </div>
  )
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const hook = project.description.split(". ")[0].replace(/\.$/, "") + "."

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="relative rounded-xl border border-border bg-card p-6 md:p-7 hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <CardArt project={project} />
        <div className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
          <ArrowUpRight className="w-5 h-5" />
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-xs font-mono text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.status && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    project.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-primary/70",
                  )}
                />
                {project.status}
              </span>
            )}
            {project.category.map((cat) => (
              <span
                key={cat}
                className={cn(
                  "px-2 py-0.5 text-[11px] font-mono rounded-md",
                  cat === "ml" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground",
                )}
              >
                {cat === "ml" ? "ML/AI" : "SWE"}
              </span>
            ))}
            {project.period && <span className="text-[11px] font-mono text-muted-foreground">{project.period}</span>}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors pr-8">
          {project.title}
        </h3>
        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-3xl mb-4">{hook}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {project.accuracy && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20">
              {project.accuracy}
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {project.technologies.slice(0, 5).join(" · ")}
          </span>
        </div>
      </article>
    </Link>
  )
}

function CompactCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="relative h-full p-4 rounded-lg border border-border group-hover:border-primary/50 transition-colors bg-card overflow-hidden">
        <CardArt project={project} />
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-mono">
          {project.category.map((cat) => (
            <span
              key={cat}
              className={cn(
                "px-2 py-0.5 rounded-md",
                cat === "ml" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground",
              )}
            >
              {cat === "ml" ? "ML/AI" : "SWE"}
            </span>
          ))}
          {project.paper && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <FileText className="w-3 h-3" />
              Published
            </span>
          )}
          <span className="ml-auto text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="font-medium group-hover:text-primary transition-colors mb-1.5">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{project.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {project.accuracy && <span className="text-primary font-medium">{project.accuracy}</span>}
          <span className="flex items-center gap-2 ml-auto">
            {project.github && <Github className="w-3.5 h-3.5" />}
            {project.demo && <Play className="w-3.5 h-3.5" />}
            {project.paper && <FileText className="w-3.5 h-3.5" />}
          </span>
        </div>
      </article>
    </Link>
  )
}
