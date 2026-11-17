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
    <section className="max-w-3xl">
      <div className="mb-12">
        <h1 className="t-page mb-4">Setup</h1>
        <p className="t-lede">
          The actual tools and hardware I use every day, not aspirational, just what's open on my screen right
          now. If something's on this list it's because I reach for it without thinking.
        </p>
        <p className="text-sm text-muted-foreground mt-2 font-mono">{"// inspired by uses.tech"}</p>
      </div>

      <div className="space-y-12">
        {uses.map((category) => {
          const Icon = ICONS[category.icon]
          return (
            <div key={category.title}>
              <h2 className="eyebrow mb-4 flex items-center gap-2">
                <Icon className="w-4 h-4" aria-hidden />
                {category.title}
              </h2>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 py-3 px-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center min-h-11 md:min-h-9 font-medium hover:text-primary transition-colors duration-150"
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
        <h2 className="eyebrow mb-4">This Site</h2>
        <p className="text-sm text-muted-foreground">{siteStack.join(" · ")}</p>
        <p className="text-sm text-muted-foreground mt-3">
          Features include an interactive terminal, live systems dashboard, visitor analytics, Arduino integration, and a donut finder.
          Source available on <a href="https://github.com/KartikDaGreat/kartikgounder-website" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">GitHub</a>.
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
