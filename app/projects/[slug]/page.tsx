import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ExternalLink, Github, FileText } from "lucide-react"
import { artFor, getProjectBySlug, getAllProjectSlugs, projects, type Project } from "@/lib/projects"
import { Art } from "@/components/art"
import { PopupLink } from "@/components/popup-link"
import { BackButton } from "@/components/back-button"
import { ImageLightbox } from "@/components/image-lightbox"

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} | Kartik Gounder`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  }
}

const STATUS_LABELS: Record<NonNullable<Project["status"]>, string> = {
  active: "In active development",
  shipped: "Shipped",
  published: "Peer-reviewed",
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const categories = project.category.length > 0 ? project.category : ["swe"]
  const hasImages = project.images && project.images.length > 0

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  const linkClass =
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <BackButton />

        <div className={hasImages ? "flex flex-col lg:flex-row gap-10" : ""}>
          {/* Image Gallery, left side on desktop */}
          {hasImages && (
            <div className="lg:w-[380px] xl:w-[440px] flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <h2 className="eyebrow mb-4">Gallery</h2>
                <ImageLightbox images={project.images!} projectTitle={project.title} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={hasImages ? "flex-1 min-w-0" : "max-w-3xl mx-auto"}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md border ${
                      cat === "ml"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    {cat === "ml" ? "ML/AI" : "SWE"}
                  </span>
                ))}
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono rounded-md border border-border text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {project.status && (
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {STATUS_LABELS[project.status]}
                  </span>
                )}
                {project.period && (
                  <span className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border rounded-md">
                    {project.period}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{project.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

              {project.role && <p className="mt-4 text-sm text-muted-foreground font-mono">{project.role}</p>}

              {/* Metric tiles, or the legacy single accuracy chip */}
              {project.metrics && project.metrics.length > 0 ? (
                <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-border bg-card px-3 py-3">
                      <div className="text-xl md:text-2xl font-bold text-primary tracking-tight">{metric.value}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                project.accuracy && (
                  <div className="mt-4 inline-block px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md border border-primary/20">
                    {project.accuracy}
                  </div>
                )
              )}
            </div>

            {/* Project illustration. Skipped when real screenshots already
                carry the page, so the two never compete. */}
            {!hasImages && (
              <div className="mb-10">
                <Art
                  src={artFor(project)}
                  alt={`Line illustration for ${project.title}`}
                  width={1376}
                  height={768}
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            )}

            {/* Links */}
            {(project.github || project.paper || project.demo) && (
              <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-border">
                {project.github && (
                  <PopupLink href={project.github} className={linkClass}>
                    <Github className="w-4 h-4" />
                    GitHub
                  </PopupLink>
                )}
                {project.paper && project.paper !== "#" && (
                  <PopupLink href={project.paper} className={linkClass}>
                    <FileText className="w-4 h-4" />
                    Paper
                  </PopupLink>
                )}
                {project.demo && (
                  <PopupLink href={project.demo} className={linkClass}>
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </PopupLink>
                )}
              </div>
            )}

            {/* ---- The story, when there is one ---- */}
            {project.story ? (
              <div className="space-y-12">
                <StorySection eyebrow="01 / The problem" title="Why this was worth building">
                  {project.story.problem}
                </StorySection>

                <StorySection eyebrow="02 / The build" title="How it works, and why it works that way">
                  {project.story.approach}
                </StorySection>

                {project.architecture && (
                  <div>
                    <h2 className="eyebrow mb-4">Architecture</h2>
                    <TerminalFrame filename="pipeline" language="flow">
                      {project.architecture}
                    </TerminalFrame>
                  </div>
                )}

                <StorySection eyebrow="03 / Outcome" title="What shipped">
                  {project.story.outcome}
                </StorySection>

                {project.story.lessons && project.story.lessons.length > 0 && (
                  <div>
                    <h2 className="eyebrow mb-2">04 / Lessons</h2>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">What I'd carry forward</h3>
                    <div className="space-y-4">
                      {project.story.lessons.map((lesson, i) => (
                        <div key={i} className="border-l-2 border-primary/50 pl-5 py-1">
                          <p className="text-foreground/90 leading-relaxed">{lesson}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Highlights become a scannable spec sheet below the narrative */}
                {project.highlights && project.highlights.length > 0 && (
                  <details className="group rounded-lg border border-border bg-card">
                    <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
                      <span className="text-sm font-semibold">
                        Full technical breakdown ({project.highlights.length} items)
                      </span>
                      <span className="text-muted-foreground text-sm font-mono group-open:rotate-90 transition-transform">
                        →
                      </span>
                    </summary>
                    <ul className="px-5 pb-5 space-y-2.5 border-t border-border pt-4">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ) : (
              /* ---- Fallback for projects without a written story ---- */
              <div className="space-y-10">
                {project.longDescription && project.longDescription.length > 0 && (
                  <div>
                    <h2 className="eyebrow mb-4">Details</h2>
                    <div className="space-y-4">
                      {project.longDescription.map((paragraph, i) => (
                        <p key={i} className="text-foreground/90 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h2 className="eyebrow mb-4">Highlights</h2>
                    <ul className="space-y-2.5">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Code Snippet */}
            {project.codeSnippet && (
              <div className="mt-12">
                <h2 className="eyebrow mb-4">Code sample</h2>
                <TerminalFrame
                  filename={project.codeSnippet.filename}
                  language={project.codeSnippet.language}
                >
                  {project.codeSnippet.code}
                </TerminalFrame>
              </div>
            )}

            {/* Technologies */}
            <div className="mt-12">
              <h2 className="eyebrow mb-4">Built with</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Next project */}
            <div className="mt-16 pt-8 border-t border-border">
              <Link href={`/projects/${next.slug}`} className="group block">
                <span className="eyebrow eyebrow-index">Next project</span>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <span className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                    {next.title}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StorySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: string[]
}) {
  return (
    <div>
      <h2 className="eyebrow mb-2">{eyebrow}</h2>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <div className="space-y-4">
        {children.map((paragraph, i) => (
          <p key={i} className="text-foreground/90 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

function TerminalFrame({
  filename,
  language,
  children,
}: {
  filename: string
  language: string
  children: string
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[oklch(0.10_0.01_250)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[oklch(0.08_0.01_250)] border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono ml-1">{filename}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono uppercase">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-foreground/90 font-mono text-[13px]">{children}</code>
      </pre>
    </div>
  )
}
