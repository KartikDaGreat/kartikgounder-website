import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { Art } from "@/components/art"
import { MetricChips } from "@/components/metric-chips"
import { patents, publications, type Publication } from "@/lib/profile"

export function ResearchSection() {
  return (
    <section className="max-w-5xl">
      <div className="mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Research</h1>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
            Three peer-reviewed papers across ACM, Springer, and IEEE, and two patent applications. None of it
            started as a paper. Each one began as a thing I was trying to make work, and the write-up came after
            it did.
          </p>
        </div>
        <div className="hidden lg:block">
          <Art
            src="/art/research-stack.png"
            alt="Line illustration of a stack of academic papers with an open journal and a magnifying glass"
            width={1376}
            height={768}
            className="w-full"
          />
        </div>
      </div>

      {/* The numbers first, then the papers */}
      <MetricChips
        items={["3 papers", "2 patents", "96.33% ensemble accuracy", "87% patient satisfaction", "$135 of hardware"]}
        className="mb-10"
      />

      <div className="mb-14">
        <h2 className="eyebrow mb-5">Publications</h2>
        <div className="space-y-3">
          {publications.map((pub) => (
            <div
              key={pub.title}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
            >
              {pub.image && (
                <div className="hidden sm:block relative w-24 h-24 flex-shrink-0 rounded-md border border-border bg-secondary/20 overflow-hidden">
                  <Image src={pub.image} alt={pub.title} fill className="object-contain p-1.5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 text-xs font-mono rounded-md bg-primary/10 text-primary">
                    {pub.venue}
                  </span>
                  <span className="text-xs text-muted-foreground">{pub.year}</span>
                </div>
                <h3 className="font-medium leading-snug group-hover:text-primary transition-colors">{pub.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{pub.description}</p>
              </div>
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
                  aria-label="View publication"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="eyebrow mb-1.5">Patents</h2>
        <p className="text-sm text-muted-foreground mb-5">Both came out of $135 of wearable hardware.</p>

        <div className="grid md:grid-cols-2 gap-5">
          {patents.map((patent, index) => (
            <article
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              {patent.image && (
                <div className="h-36 bg-secondary/20 flex items-center justify-center border-b border-border relative overflow-hidden">
                  <Image
                    src={patent.image}
                    alt={patent.title}
                    width={400}
                    height={160}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-mono rounded-md bg-secondary text-secondary-foreground">
                    Patent
                  </span>
                  <span className="text-xs text-muted-foreground">{patent.year}</span>
                </div>
                <h3 className="font-medium leading-snug mb-1.5 group-hover:text-primary transition-colors">
                  {patent.title}
                </h3>
                {patent.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{patent.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
