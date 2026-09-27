import { Award } from "lucide-react"
import { Art } from "@/components/art"
import { Expander } from "@/components/expander"
import { Reveal } from "@/components/motion/reveal"
import { accolades, certifications, degrees, earlierSchooling, leadership, type Degree } from "@/lib/profile"

export function AcademicsSection() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Education</h1>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
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
      <div className="mb-14">
        <h2 className="eyebrow mb-5">Degrees</h2>
        <div className="space-y-4">
          {degrees.map((degree) => (
            <Reveal key={degree.school}>
              <DegreeCard degree={degree} />
            </Reveal>
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
      <div className="mb-14">
        <h2 className="eyebrow mb-5">Certifications</h2>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <Reveal key={cert.title} className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-sm">{cert.title}</h3>
                <span className="text-xs text-primary">{cert.issuer}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">
                  {cert.issued}, valid to {cert.expires}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm">
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-9 font-medium text-primary hover:underline underline-offset-4"
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
            </Reveal>
          ))}
        </div>
      </div>

      {/* Leadership: one line per role, the single strongest fact */}
      <div className="mb-14">
        <h2 className="eyebrow mb-5">Leadership</h2>
        <div className="space-y-2">
          {leadership.map((item) => (
            <Reveal
              key={item.title}
              className="rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="text-xs text-primary">{item.org}</span>
                <span className="text-xs text-muted-foreground font-mono ml-auto">{item.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.highlight}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Awards & community: a badge wall, not more cards */}
      <div>
        <h2 className="eyebrow mb-5">Awards & community</h2>
        <div className="flex flex-wrap gap-2">
          {accolades.map((item) => (
            <span
              key={item.title}
              className="inline-flex flex-wrap items-baseline gap-x-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:border-primary/50 transition-colors"
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.org}
                {item.detail ? ` · ${item.detail}` : ""} · {item.period}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function DegreeCard({ degree }: { degree: Degree }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {degree.current && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In progress
              </span>
            )}
            <span className="text-xs text-muted-foreground font-mono">{degree.period}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight">{degree.title}</h3>
          <p className="text-sm text-primary mt-0.5">{degree.school}</p>
        </div>

        {/* GPA block, right-aligned on wide screens */}
        {degree.gpa && (
          <div className="flex items-start gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary tracking-tight leading-none">{degree.gpa}</div>
              <div className="text-[11px] text-muted-foreground mt-1">GPA</div>
            </div>
            {degree.rank && (
              <div className="text-right border-l border-border pl-3">
                <div className="text-2xl font-bold tracking-tight leading-none">{degree.rank.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{degree.rank.label}</div>
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
                <div key={term.label} className="grid md:grid-cols-[160px_1fr] gap-x-4 gap-y-1.5 items-baseline">
                  <p className="text-xs font-mono text-muted-foreground">{term.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {term.items.map((course) => (
                      <span
                        key={course}
                        className="text-[11px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Expander>
        </div>
      )}
    </article>
  )
}
