import { cn } from "@/lib/utils"

/**
 * Theme-adaptive line art. The PNGs in public/art carry the drawing in their
 * alpha channel (white was knocked out), so instead of rendering the bitmap we
 * use it as a CSS mask and let the background color paint the lines. That way
 * the art follows --foreground across all 54 palettes; a dark:invert approach
 * would track the OS preference, not the randomly chosen palette.
 *
 * Ink weight comes from --art-ink-opacity / --art-texture-opacity in
 * globals.css, which are measured to hold steady contrast across every
 * palette. Never add a color alpha (bg-foreground/80) on top of them.
 */
export function Art({
  src,
  alt,
  width,
  height,
  className,
  cover = false,
  weight = "ink",
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  /** Fill the parent (mask-size: cover) instead of keeping aspect ratio. */
  cover?: boolean
  /** "ink" for a section illustration, "texture" for background decoration. */
  weight?: "ink" | "texture"
}) {
  const style: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: cover ? "cover" : "contain",
    maskSize: cover ? "cover" : "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: cover ? "left center" : "center",
    maskPosition: cover ? "left center" : "center",
    opacity: weight === "texture" ? "var(--art-texture-opacity)" : "var(--art-ink-opacity)",
  }
  if (!cover) style.aspectRatio = `${width} / ${height}`

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("bg-foreground", className)}
      style={style}
    />
  )
}
