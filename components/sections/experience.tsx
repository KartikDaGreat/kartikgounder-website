import { ViewTransition } from "react"
import { Award } from "lucide-react"
import { PopupLink } from "@/components/popup-link"
import { TimelineBeat, TimelineDot, TimelineItem, TimelineTrack } from "@/components/motion/timeline"
import { ImpactStrip } from "@/components/impact-strip"
import { experiences, skills, TYPE_LABEL, type Experience, type Highlight } from "@/lib/profile"
import { Expander } from "@/components/expander"

/** Bullets shown before the "+n more" fold kicks in. */
const VISIBLE_HIGHLIGHTS = 2

const CURRENT_ORDER: Experience["type"][] = ["internship", "research", "teaching"]
const current = experiences
  .filter((e) => e.current)
  .sort((a, b) => CURRENT_ORDER.indexOf(a.type) - CURRENT_ORDER.indexOf(b.type))
const past = experiences.filter((e) => !e.current)
const years = [...new Set(past.map((e) => e.year))].sort((a, b) => b - a)

export function ExperienceSection() {
  return (
    <section className="max-w-3xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Building</h1>
        <p className="text-muted-foreground">
          Seven internships, plus research and teaching at Columbia. Every bullet in the timeline shipped to real users or real benchmarks.
        </p>
      </div>

      {/* Right now: pinned above the timeline so current roles are never a
          scroll away. Each row is the same role as a card on Home, so it
          morphs from there (role-morph in globals.css). */}
      <div className="mb-14">
        <h2 className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden />
          Right now
        </h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {current.map((exp) => (
            <ViewTransition
              key={exp.title}
              name={exp.nowId ? `role-${exp.nowId}` : undefined}
              share="role-morph"
              default="none"
            >
            <article className="grid sm:grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-1 p-5 bg-card">
              <p className="text-xs font-medium text-primary pt-1">{TYPE_LABEL[exp.type]}</p>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <h3 className="font-heading font-bold tracking-tight">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
                </div>
                <p className="text-sm text-foreground/80">{exp.company}</p>
                <ul className="space-y-1.5 mt-2.5">
                  {exp.highlights.map((highlight) => (
                    <HighlightItem key={highlight.lead} highlight={highlight} />
                  ))}
                </ul>
              </div>
            </article>
            </ViewTransition>
          ))}
        </div>
      </div>

      <h2 className="font-heading text-xl font-bold tracking-tight mb-6">Before this</h2>
      {/*
        The line draws down as you scroll (components/motion/timeline.tsx).
        Year groups, cards, and the skills block are view-transition
        boundaries with only `update` on, so opening "+n more" makes
        everything below glide down instead of jumping.
      */}
      <TimelineTrack className="ml-3 md:ml-6 space-y-10 pb-2">
        {years.map((year) => (
          <ViewTransition key={year} update="displaced" default="none">
          <div>
            <div className="flex items-center gap-4 mb-5 -ml-[13px] md:-ml-[13px]">
              <TimelineDot className="w-6 h-6 rounded-full bg-primary flex-shrink-0" />
              <span className="text-lg font-bold">{year}</span>
            </div>
            <div className="space-y-4 pl-6 md:pl-8">
              {past
                .filter((e) => e.year === year)
                .map((exp) => (
                  <ViewTransition key={exp.title + exp.period} update="displaced" default="none">
                    <TimelineItem>
                      <ExperienceCard experience={exp} />
                    </TimelineItem>
                  </ViewTransition>
                ))}
            </div>
          </div>
          </ViewTransition>
        ))}
      </TimelineTrack>

      {/* Skills Section */}
      <ViewTransition update="displaced" default="none">
      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">Technical Skills</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-medium mb-3">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </ViewTransition>
    </section>
  )
}

function HighlightItem({ highlight }: { highlight: Highlight }) {
  return (
    <li className="text-sm text-muted-foreground flex items-start gap-2">
      <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
      <span>
        {/* The keyword is set in mono so it reads as a label, not just bold prose. */}
        <span className="font-mono text-[13px] text-foreground">{highlight.lead}</span>
        <span className="text-muted-foreground/50"> / </span>
        {highlight.text}
      </span>
    </li>
  )
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const visible = experience.highlights.slice(0, VISIBLE_HIGHLIGHTS)
  const folded = experience.highlights.slice(VISIBLE_HIGHLIGHTS)

  return (
    <article className="p-5 rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
        <h3 className="font-semibold">
          {experience.company} <span className="font-normal text-muted-foreground">· {experience.title}</span>
        </h3>
        <span className="text-xs text-muted-foreground font-mono">{experience.period}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{experience.location}</p>
      {experience.impact && (
        <TimelineBeat>
          <ImpactStrip items={experience.impact} className="mb-4 pb-4 border-b border-border/60" />
        </TimelineBeat>
      )}
      <ul className="space-y-1.5">
        {visible.map((highlight) => (
          <HighlightItem key={highlight.lead} highlight={highlight} />
        ))}
      </ul>
      {folded.length > 0 && (
        <Expander label={`+${folded.length} more`}>
          <ul className="space-y-1.5 mt-1.5">
            {folded.map((highlight) => (
              <HighlightItem key={highlight.lead} highlight={highlight} />
            ))}
          </ul>
        </Expander>
      )}
      {experience.certificate && (
        <div className="mt-3">
          <PopupLink
            href={experience.certificate}
            className="inline-flex items-center gap-1.5 min-h-9 px-3 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Award className="w-3 h-3" />
            Certificate
          </PopupLink>
        </div>
      )}
    </article>
  )
}
