import { Award } from "lucide-react"
import { Art } from "@/components/art"
import { Expander } from "@/components/expander"
import { accolades, certifications, degrees, earlierSchooling, leadership, type Degree } from "@/lib/profile"

export function AcademicsSection() {
  return (
    <section>
      <div className="mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 lg:items-center">
        <div>
          <h1 className="t-page mb-4">Education</h1>
          <p className="t-lede">
            Columbia MS in Computer Science, finishing December 2026. Before that, a B.Tech at VIT where I
            graduated 11th out of 4,000, plus student council, an IEEE technical board seat, and a few trophies
            that were mostly an excuse to build things on a deadline.
          </p>
        </div>
        <div className="hidden lg:block">
          <Art
            src="/art/education-campus.png"
            alt="Line illustration of a university building beneath a giant open notebook of study diagrams"
            width={1408}
            height={768}
            className="w-full"
          />
        </div>
      </div>

      {/* Degrees */}
      <div className="mb-12">
        <h2 className="eyebrow mb-4">Degrees</h2>
        <div className="space-y-4">
          {degrees.map((degree) => (
            <div key={degree.school}>
              <DegreeCard degree={degree} />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border/60 divide-y divide-border/60">
          {earlierSchooling.map((item) => (
            <div
              key={item.school}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground/80">{item.title}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {item.school} · {item.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications: with the validation number so anyone can check it */}
      <div className="mb-12">
        <h2 className="eyebrow mb-4">Certifications</h2>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <div key={cert.title} className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-sm">{cert.title}</h3>
                <span className="text-xs text-primary">{cert.issuer}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">
                  {cert.issued}, valid to {cert.expires}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-11 md:min-h-9 font-medium text-primary hover:underline underline-offset-4"
                >
                  <Award className="w-3.5 h-3.5" />
                  View certificate
                </a>
                <span className="text-xs text-muted-foreground">
                  Validation number <span className="font-mono text-foreground/80 break-all">{cert.validation}</span> at{" "}
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    aws.amazon.com/verification
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership: one line per role, the single strongest fact */}
      <div className="mb-12">
        <h2 className="eyebrow mb-4">Leadership</h2>
        <div className="space-y-2">
          {leadership.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="text-xs text-primary">{item.org}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">{item.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.highlight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awards & community: one hairline list, not more cards */}
      <div>
        <h2 className="eyebrow mb-4">Awards & community</h2>
        <ul className="rounded-xl border border-border bg-card divide-y divide-border">
          {accolades.map((item) => (
            <li
              key={item.title}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.org}
                {item.detail ? ` · ${item.detail}` : ""} · {item.period}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DegreeCard({ degree }: { degree: Degree }) {
  return (
    <article className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {degree.current && (
              <span className="t-meta inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" aria-hidden />
                In progress
              </span>
            )}
            <span className="text-xs text-muted-foreground font-mono">{degree.period}</span>
          </div>
          <h3 className="t-h2">{degree.title}</h3>
          <p className="text-sm text-primary mt-1">{degree.school}</p>
        </div>

        {/* GPA block, right-aligned on wide screens */}
        {degree.gpa && (
          <div className="flex items-start gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums text-foreground tracking-tight leading-none">{degree.gpa}</div>
              <div className="text-xs text-muted-foreground mt-1">GPA</div>
            </div>
            {degree.rank && (
              <div className="text-right border-l border-border pl-3">
                <div className="text-2xl font-semibold tabular-nums text-foreground tracking-tight leading-none">{degree.rank.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{degree.rank.label}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {(degree.focus || degree.gpaNote) && (
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          {degree.focus && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground/70">Focus:</span> {degree.focus}
            </p>
          )}
          {degree.gpaNote && <p className="text-xs text-muted-foreground">{degree.gpaNote}</p>}
        </div>
      )}

      {degree.coursework && (
        <div className="mt-4 pt-3 border-t border-border">
          <Expander label="coursework">
            <div className="space-y-3 mb-1">
              {degree.coursework.map((term) => (
                <div key={term.label} className="grid md:grid-cols-[160px_1fr] gap-x-4 gap-y-1 items-baseline">
                  <p className="text-xs font-mono text-muted-foreground">{term.label}</p>
                  <p className="text-sm text-muted-foreground">{term.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </Expander>
        </div>
      )}
    </article>
  )
}
