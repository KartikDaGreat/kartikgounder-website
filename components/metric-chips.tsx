import { cn } from "@/lib/utils"

/**
 * The numbers that would otherwise hide in prose, set as a plain typographic
 * row: static facts, so no pill background or border.
 */
export function MetricChips({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="font-heading text-sm font-semibold tabular-nums">
          {item}
        </li>
      ))}
    </ul>
  )
}
