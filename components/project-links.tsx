import { FileText, Github, Globe, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectLink } from "@/lib/projects"

const ICONS = { live: Globe, video: Play, code: Github, paper: FileText } as const

/**
 * Every outbound project link, in one order and one style, on the project page
 * and on both card sizes. All of them open in a normal new tab: popup windows
 * get blocked and hide the address bar.
 *
 * relative z-10 lets these sit above a card's stretched title link. Notes say
 * what a visitor can actually do at a link, and only the full-size row has the
 * room to show them.
 */
export function ProjectLinks({
  links,
  size = "md",
  className,
}: {
  links: ProjectLink[]
  size?: "sm" | "md"
  className?: string
}) {
  if (links.length === 0) return null

  const notes = size === "md" ? links.filter((link) => link.note) : []

  return (
    <div className={className}>
      <div className={cn("flex flex-wrap items-center", size === "sm" ? "gap-2" : "gap-3")}>
        {links.map((link) => {
          const Icon = ICONS[link.kind]
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in a new tab)`}
              className={cn(
                "relative z-10 btn btn-secondary",
                size === "sm" && "btn-sm",
                link.kind === "live" && "text-primary border-primary/40",
              )}
            >
              <Icon aria-hidden className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
              {link.label}
            </a>
          )
        })}
      </div>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {notes.map((link) => (
            <li key={link.href} className="text-sm text-muted-foreground">
              <span className="text-foreground/80">{link.label}:</span> {link.note}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
