import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, FileText } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects"

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} | Kartik Gounder`,
    description: project.description,
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const categories = project.category.length > 0 ? project.category : ["swe"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>

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

        {/* Links */}
        {(project.github || project.paper || project.demo) && (
          <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-border">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {project.paper && project.paper !== "#" && (
              <a
                href={project.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Paper
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </a>
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
  )
}
