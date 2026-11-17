import { ViewTransition } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { artFor, getProjectBySlug, getAllProjectSlugs, projectLinks, projects, type Project } from "@/lib/projects"
import { Art } from "@/components/art"
import { ProjectLinks } from "@/components/project-links"
import { BackButton } from "@/components/back-button"
import { ImageLightbox } from "@/components/image-lightbox"
import { basics } from "@/lib/profile"

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  // The root layout's title template appends the site name.
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/projects/${project.slug}`,
      images: ["/art/og-texture.png"],
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
      types: { "text/markdown": `/projects/${project.slug}.md` },
    },
  }
}

const STATUS_LABELS: Record<NonNullable<Project["status"]>, string> = {
  active: "In active development",
  shipped: "Shipped",
  published: "Peer-reviewed",
}

const CATEGORY_LABELS: Record<"swe" | "ml", string> = { swe: "SWE", ml: "ML/AI" }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const categories = project.category.length > 0 ? project.category : (["swe"] as const)
  const hasImages = project.images && project.images.length > 0
  const links = projectLinks(project)

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  // Static metadata reads as one line, not a row of pills.
  const metaBefore = [...categories.map((cat) => CATEGORY_LABELS[cat]), ...(project.tags ?? [])]

  return (
    // Arriving from the site fades the page in while the title morphs from
    // its card. Keyed by slug so "Next project" re-enters too.
    <ViewTransition key={project.slug} enter={{ "nav-forward": "page-in", default: "none" }} default="none">
    <main id="main" className="min-h-dvh bg-background text-foreground">
      <div className={hasImages ? "max-w-6xl mx-auto px-5 md:px-10 py-12 md:py-16" : "max-w-3xl mx-auto px-5 md:px-10 py-12 md:py-16"}>
        <BackButton />

        {/* Header: full width and always first, so phones see the title before the gallery */}
        <header className="mb-12 pb-12 border-b border-border">
          <p className="t-meta mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{metaBefore.join(" · ")}</span>
            {project.status && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  {project.status === "active" && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-success" />}
                  {STATUS_LABELS[project.status]}
                </span>
              </>
            )}
            {project.period && (
              <>
                <span aria-hidden>·</span>
                <span>{project.period}</span>
              </>
            )}
          </p>

          <h1 className="t-page mb-4">
            <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
              <span className="inline-block">{project.title}</span>
            </ViewTransition>
          </h1>
          <p className="t-lede">{project.description}</p>

          {project.role && <p className="mt-4 t-meta">{project.role}</p>}

          {/* Metric tiles, or the legacy single accuracy figure */}
          {project.metrics && project.metrics.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse rounded-lg border border-border bg-card p-4">
                  <dt className="text-xs text-muted-foreground mt-1">{metric.label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-foreground tracking-tight">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            project.accuracy && <p className="mt-4 text-sm font-medium text-primary">{project.accuracy}</p>
          )}

          <ProjectLinks links={links} className="mt-8" />
        </header>

        <div className={hasImages ? "lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12" : undefined}>
          {hasImages && (
            <section aria-labelledby="gallery-heading" className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-16">
                <h2 id="gallery-heading" className="eyebrow mb-4">Gallery</h2>
                <ImageLightbox images={project.images!} projectTitle={project.title} />
              </div>
            </section>
          )}

          <div className="min-w-0">
            {/* Project illustration. Skipped when real screenshots already
                carry the page, so the two never compete. */}
            {!hasImages && (
              <div className="mb-12">
                <Art
                  src={artFor(project)}
                  alt={`Line illustration for ${project.title}`}
                  width={1376}
                  height={768}
                  className="w-full max-w-2xl mx-auto"
                />
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
                  <section>
                    <h2 className="eyebrow mb-4">Architecture</h2>
                    <TerminalFrame filename="pipeline" language="flow">
                      {project.architecture}
                    </TerminalFrame>
                  </section>
                )}

                <StorySection eyebrow="03 / Outcome" title="What shipped">
                  {project.story.outcome}
                </StorySection>

                {project.story.lessons && project.story.lessons.length > 0 && (
                  <section>
                    <h2 className="eyebrow mb-2">04 / Lessons</h2>
                    <h3 className="text-2xl font-semibold mb-4 tracking-tight">What I'd carry forward</h3>
                    <div className="space-y-4">
                      {project.story.lessons.map((lesson, i) => (
                        <div key={i} className="border-l-2 border-border pl-4 py-1">
                          <p className="prose-measure text-foreground/90">{lesson}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Highlights become a scannable spec sheet below the narrative */}
                {project.highlights && project.highlights.length > 0 && (
                  <details className="group rounded-lg border border-border bg-card">
                    <summary className="flex min-h-11 items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-semibold">
                        Full technical breakdown ({project.highlights.length} items)
                      </span>
                      <span
                        aria-hidden
                        className="text-muted-foreground text-sm font-mono group-open:rotate-90 transition-transform duration-150"
                      >
                        →
                      </span>
                    </summary>
                    <ul className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ) : (
              /* ---- Fallback for projects without a written story ---- */
              <div className="space-y-12">
                {project.longDescription && project.longDescription.length > 0 && (
                  <section>
                    <h2 className="eyebrow mb-4">Details</h2>
                    <div className="space-y-4">
                      {project.longDescription.map((paragraph, i) => (
                        <p key={i} className="prose-measure text-foreground/90">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {project.highlights && project.highlights.length > 0 && (
                  <section>
                    <h2 className="eyebrow mb-4">Highlights</h2>
                    <ul className="space-y-3">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="prose-measure flex items-start gap-3 text-foreground/90">
                          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* Code Snippet */}
            {project.codeSnippet && (
              <section className="mt-12">
                <h2 className="eyebrow mb-4">Code sample</h2>
                <TerminalFrame
                  filename={project.codeSnippet.filename}
                  language={project.codeSnippet.language}
                >
                  {project.codeSnippet.code}
                </TerminalFrame>
              </section>
            )}

            {/* Technologies */}
            <section className="mt-12">
              <h2 className="eyebrow mb-4">Built with</h2>
              <p className="t-meta">{project.technologies.join(" · ")}</p>
            </section>

            {/* Next project */}
            <div className="mt-16 pt-8 border-t border-border">
              <Link href={`/projects/${next.slug}`} transitionTypes={["nav-forward"]} className="group block">
                <span className="eyebrow eyebrow-index">Next project</span>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <span className="text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors duration-150">
                    <ViewTransition name={`project-title-${next.slug}`} share="text-morph" default="none">
                      <span className="inline-block">{next.title}</span>
                    </ViewTransition>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-[color,translate] duration-150 flex-shrink-0"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t border-border pt-8 t-meta flex flex-wrap gap-x-6 gap-y-2">
          <span>{basics.name}</span>
          <a href={`mailto:${basics.email}`} className="hover:text-foreground transition-colors duration-150">
            {basics.email}
          </a>
          <a
            href={basics.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-150"
          >
            GitHub
          </a>
          <a
            href={basics.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-150"
          >
            LinkedIn
          </a>
        </footer>
      </div>
    </main>
    </ViewTransition>
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
    <section>
      <h2 className="eyebrow mb-2">{eyebrow}</h2>
      <h3 className="text-2xl font-semibold mb-4 tracking-tight">{title}</h3>
      <div className="space-y-4">
        {children.map((paragraph, i) => (
          <p key={i} className="prose-measure text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
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
  // Theme surfaces, not a hard-coded dark frame, so the code reads in light mode too.
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-secondary border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        <span className="text-xs text-muted-foreground font-mono uppercase">{language}</span>
      </div>
      <pre tabIndex={0} aria-label={filename} className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{children}</code>
      </pre>
    </div>
  )
}
