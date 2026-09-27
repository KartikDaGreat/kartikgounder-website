import { Monitor, Code2, Terminal, Wrench, Coffee } from "lucide-react"
import { Art } from "@/components/art"
import { siteStack, uses, type UseCategory } from "@/lib/profile"

const ICONS: Record<UseCategory["icon"], React.ElementType> = {
  code: Code2,
  terminal: Terminal,
  wrench: Wrench,
  monitor: Monitor,
  coffee: Coffee,
}

export function UsesSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Setup</h1>
        <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
          The actual tools and hardware I use every day, not aspirational, just what's open on my screen right
          now. If something's on this list it's because I reach for it without thinking.
        </p>
        <p className="text-sm text-muted-foreground mt-2 font-mono">{"// inspired by uses.tech"}</p>
      </div>

      <div className="space-y-10">
        {uses.map((category) => {
          const Icon = ICONS[category.icon]
          return (
            <div key={category.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.title}
              </h2>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center min-h-9 font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* This site's stack */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">This Site</h2>
        <div className="flex flex-wrap gap-2">
          {siteStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Features include an interactive terminal, live systems dashboard, visitor analytics, Arduino integration, and a donut finder.
          Source available on <a href="https://github.com/KartikDaGreat/kartikgounder-website" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
        </p>
      </div>

      {/* Flat-lay closer */}
      <div className="mt-12 max-w-lg mx-auto">
        <Art
          src="/art/setup-desk.png"
          alt="Overhead line illustration of a desk with a mechanical keyboard, mouse, headphones, notebook, and coffee"
          width={1408}
          height={768}
          className="w-full"
        />
      </div>
    </section>
  )
}
