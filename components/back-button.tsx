import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/** A real link, so cmd-click and "open in new tab" work. */
export function BackButton({
  href = "/#projects",
  label = "Back to Projects",
}: {
  href?: string
  label?: string
}) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 mb-8"
    >
      <ArrowLeft aria-hidden className="w-4 h-4" />
      {label}
    </Link>
  )
}
