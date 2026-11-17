"use client"

import { useState } from "react"
import { ViewTransition } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { artFor, projectLinks, projects, type Project } from "@/lib/projects"
import { Art } from "@/components/art"
import { ProjectLinks } from "@/components/project-links"

type Filter = "all" | "swe" | "ml"

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "swe", label: "Software" },
  { id: "ml", label: "ML / AI" },
]

const CATEGORY_LABELS: Record<"swe" | "ml", string> = { swe: "SWE", ml: "ML/AI" }

// Numbered against the full flagship list so a card keeps its number when filtered.
const allFeatured = projects.filter((p) => p.featured)

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all")

  const matches = (p: Project) => filter === "all" || p.category.includes(filter)
  const featured = projects.filter((p) => p.featured && matches(p))
  const rest = projects.filter((p) => !p.featured && matches(p))
  const shown = featured.length + rest.length

  return (
    <section>
      <div className="mb-12">
        <h1 className="t-page mb-4">Projects</h1>
        <p className="t-lede">
          Fifteen builds, from trust middleware for AI coding agents to smart glasses held together with
          3D-printed parts. Three shipped as peer-reviewed papers. Each page tells the story: the problem,
          the decisions, and what I'd do differently.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex items-center min-h-11 md:min-h-9 px-4 rounded-full text-xs font-medium border transition-colors duration-150",
                  filter === f.id
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="t-meta" aria-live="polite">
            Showing {shown} of {projects.length}
          </p>
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="eyebrow mb-4">Flagship builds</h2>
          <div className="space-y-4">
            {featured.map((project) => (
              <FeaturedCard key={project.slug} project={project} index={allFeatured.indexOf(project)} />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <h2 className="eyebrow mb-4">The rest of the shelf</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {rest.map((project) => (
              <CompactCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      )}

      {shown === 0 && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">Nothing in this bucket.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFilter("all")}>
            Show everything
          </button>
        </div>
      )}
    </section>
  )
}

/** Static metadata as one quiet line instead of a row of pills. */
function metaParts(project: Project, ...extra: (string | number | undefined)[]) {
  return [
    ...project.category.map((cat) => CATEGORY_LABELS[cat]),
    ...(project.tags ?? []),
    ...extra,
  ].filter((part) => part !== undefined && part !== "")
}

/**
 * The title morphs into the project page's heading (text-morph in
 * globals.css). The name must stay unique on screen, and it is: the Projects
 * section and a project page are never mounted together.
 */
export function ProjectTitle({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`project-title-${slug}`} share="text-morph" default="none">
      <span className="inline-block">{children}</span>
    </ViewTransition>
  )
}

/** Faint category illustration bleeding off the card's right edge. Featured cards only. */
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
  const meta = metaParts(project, project.period)

  // Both cards use a stretched link: the title's ::after covers the card, so
  // the outbound links can sit on top without nesting <a> inside <a>.
  return (
    <article className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors duration-150 overflow-hidden">
      <CardArt project={project} />
      <div
        aria-hidden
        className="absolute top-6 right-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,translate] duration-150"
      >
        <ArrowUpRight className="w-5 h-5" />
      </div>

      <p className="t-meta mb-3 pr-8 flex flex-wrap items-center gap-x-2">
        <span>{String(index + 1).padStart(2, "0")}</span>
        {project.status && (
          <>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn("w-1.5 h-1.5 rounded-full", project.status === "active" ? "bg-success" : "bg-primary/70")}
              />
              {project.status}
            </span>
          </>
        )}
        {meta.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>{meta.join(" · ")}</span>
          </>
        )}
      </p>

      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-150 pr-8">
        <Link
          href={`/projects/${project.slug}`}
          transitionTypes={["nav-forward"]}
          className="after:absolute after:inset-0 after:content-['']"
        >
          <ProjectTitle slug={project.slug}>{project.title}</ProjectTitle>
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground max-w-3xl mb-4">{hook}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {project.accuracy && <span className="text-sm font-medium text-primary">{project.accuracy}</span>}
        <span className="t-meta">{project.technologies.slice(0, 5).join(" · ")}</span>
        <ProjectLinks links={projectLinks(project)} size="sm" className="sm:ml-auto" />
      </div>
    </article>
  )
}

function CompactCard({ project }: { project: Project }) {
  return (
    <article className="group relative h-full p-4 rounded-xl border border-border hover:border-primary/50 transition-colors duration-150 bg-card">
      <p className="t-meta mb-2">{metaParts(project, project.year).join(" · ")}</p>
      <h3 className="t-h3 group-hover:text-primary transition-colors duration-150 mb-2">
        <Link
          href={`/projects/${project.slug}`}
          transitionTypes={["nav-forward"]}
          className="after:absolute after:inset-0 after:content-['']"
        >
          <ProjectTitle slug={project.slug}>{project.title}</ProjectTitle>
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{project.description}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {project.accuracy && <span className="text-sm font-medium text-primary">{project.accuracy}</span>}
        <ProjectLinks links={projectLinks(project)} size="sm" className="ml-auto" />
      </div>
    </article>
  )
}
