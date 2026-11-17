import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { Art } from "@/components/art"
import { MetricChips } from "@/components/metric-chips"
import { patents, publications, type Publication } from "@/lib/profile"
import { cn } from "@/lib/utils"

export function ResearchSection() {
  return (
    <section className="max-w-5xl">
      <div className="mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 lg:items-center">
        <div>
          <h1 className="t-page mb-4">Research</h1>
          <p className="t-lede">
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
        className="mb-12"
      />

      <div className="mb-12">
        <h2 className="eyebrow mb-4">Publications</h2>
        <div className="space-y-3">
          {publications.map((pub) => (
            <PublicationCard key={pub.title} pub={pub} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="eyebrow mb-2">Patents</h2>
        <p className="text-sm text-muted-foreground mb-4">Both came out of $135 of wearable hardware.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {patents.map((patent, index) => (
            <article key={index} className="overflow-hidden rounded-xl border border-border bg-card">
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

              <div className="p-6">
                <p className="t-meta mb-2">Patent · {patent.year}</p>
                <h3 className="font-medium leading-snug mb-2">{patent.title}</h3>
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

/**
 * When a paper has a link, the title is the link and its ::after stretches over
 * the whole card, so the card is one target with one accessible name. Cards
 * without a link get no hover state, since there is nothing to click.
 */
function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article
      className={cn(
        "relative flex items-start gap-4 rounded-xl border border-border bg-card p-4",
        pub.link && "hover:border-primary/50 focus-within:border-primary/50 transition-colors duration-150",
      )}
    >
      {pub.image && (
        <div className="hidden sm:block relative w-24 h-24 flex-shrink-0 rounded-md border border-border bg-secondary/20 overflow-hidden">
          {/* Decorative: the title sits right next to it. */}
          <Image src={pub.image} alt="" sizes="96px" fill className="object-contain p-1.5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="t-meta mb-2">
          {pub.venue} · {pub.year}
        </p>
        <h3 className="font-medium leading-snug">
          {pub.link ? (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-150 after:absolute after:inset-0 after:rounded-xl"
            >
              {pub.title}
              <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 align-[-0.125em] text-muted-foreground" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            pub.title
          )}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-1">{pub.description}</p>
      </div>
    </article>
  )
}
