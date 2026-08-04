import { cn } from "@/lib/utils"

/** Row of small mono chips for the numbers that would otherwise hide in prose. */
export function MetricChips({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <span
          key={item}
          className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-primary/10 text-primary border border-primary/20 whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </div>
  )
}
