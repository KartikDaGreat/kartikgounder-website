import { cn } from "@/lib/utils"

/**
 * Theme-adaptive line art. The PNGs in public/art carry the drawing in their
 * alpha channel (white was knocked out), so instead of rendering the bitmap we
 * use it as a CSS mask and let the background color paint the lines. That way
 * the art follows --foreground across all ~53 palettes; a dark:invert approach
 * would track the OS preference, not the randomly chosen palette.
 */
export function Art({
  src,
  alt,
  width,
  height,
  className,
  cover = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  /** Fill the parent (mask-size: cover) instead of keeping aspect ratio. */
  cover?: boolean
}) {
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: cover ? "cover" : "contain",
    maskSize: cover ? "cover" : "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: cover ? "left center" : "center",
    maskPosition: cover ? "left center" : "center",
  }
  if (!cover) mask.aspectRatio = `${width} / ${height}`

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("bg-foreground/80", className)}
      style={mask}
    />
  )
}
