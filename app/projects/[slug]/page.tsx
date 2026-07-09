import { notFound } from "next/navigation"
import { ExternalLink, Github, FileText } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects"
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
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const categories = project.category.length > 0 ? project.category : ["swe"]
  const hasImages = project.images && project.images.length > 0

  const linkClass =
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <BackButton />

        <div className={hasImages ? "flex flex-col lg:flex-row gap-10" : ""}>
          {/* Image Gallery — left side on desktop */}
          {hasImages && (
            <div className="lg:w-[380px] xl:w-[440px] flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Gallery</h2>
                <ImageLightbox images={project.images!} projectTitle={project.title} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={hasImages ? "flex-1 min-w-0" : "max-w-3xl mx-auto"}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md ${
                      cat === "ml"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-secondary text-secondary-foreground border border-border"
                    }`}
                  >
                    {cat === "ml" ? "ML/AI" : "SWE"}
                  </span>
                ))}
                {project.period && (
                  <span className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border rounded-md">
                    {project.period}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{project.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

              {project.accuracy && (
                <div className="mt-4 inline-block px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md border border-primary/20">
                  {project.accuracy}
                </div>
              )}
            </div>

            {/* Links — open in popup windows */}
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

            {/* Detailed description */}
            {project.longDescription && project.longDescription.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Details</h2>
                <div className="space-y-4">
                  {project.longDescription.map((paragraph, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Highlights</h2>
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

            {/* Code Snippet */}
            {project.codeSnippet && (
              <div className="mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Code Sample</h2>
                <div className="rounded-lg border border-border overflow-hidden bg-[oklch(0.10_0.01_250)]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[oklch(0.08_0.01_250)] border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/70" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                        <div className="w-2 h-2 rounded-full bg-green-500/70" />
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono ml-1">
                        {project.codeSnippet.filename}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {project.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-foreground/90 font-mono text-[13px]">
                      {project.codeSnippet.code}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Technologies</h2>
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
          </div>
        </div>
      </div>
    </div>
  )
}
