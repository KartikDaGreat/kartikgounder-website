import { Art } from "@/components/art"
import { cn } from "@/lib/utils"

export interface Impact {
  /**
   * Slug of a glyph in /public/art, without the `icon-` prefix or extension.
   * Optional, but a slug naming a file that does not exist paints a solid
   * block rather than nothing: leave it off until the art is in place.
   */
  icon?: string
  /** The keyword or number that carries the contribution. Set in the heading face. */
  value: string
  /** What the value refers to. Small mono, deliberately quieter. */
  label: string
}

/**
 * The headline contributions of a role, set as typography rather than pills:
 * the term does the shouting, the label explains it, a hairline separates them.
 * Glyphs are optional so a role reads fine before its icon exists.
 */
export function ImpactStrip({ items, className }: { items: Impact[]; className?: string }) {
  if (items.length === 0) return null

  return (
    // Stacked on phones, a row with hairline dividers from sm up. The dividers
    // are gated behind sm because a wrapped row leaves the first item of the
    // second line with a rule dangling off its left edge.
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-3", className)}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn("flex items-center gap-2.5 sm:pr-5", i > 0 && "sm:pl-5 sm:border-l sm:border-border")}
        >
          {item.icon && (
            <Art
              src={`/art/icon-${item.icon}.png`}
              /* Decorative: the value and label next to it already say this. */
              alt=""
              width={128}
              height={128}
              /* 32px: below this the 8px-at-1024 strokes drop under a pixel and go muddy. */
              className="w-8 h-8 flex-shrink-0"
            />
          )}
          <div>
            <div className="font-heading text-[15px] font-bold leading-none tracking-tight">{item.value}</div>
            <div className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground leading-none">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
