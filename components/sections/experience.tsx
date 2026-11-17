import { ViewTransition } from "react"
import { Award } from "lucide-react"
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
        <h1 className="t-page mb-4">Building</h1>
        <p className="t-lede">
          Seven internships, plus research and teaching at Columbia. Every bullet in the timeline shipped to real users or real benchmarks.
        </p>
      </div>

      {/* Right now: pinned above the timeline so current roles are never a
          scroll away. Each row is the same role as a card on Home, so it
          morphs from there (role-morph in globals.css). */}
      <div className="mb-12">
        <h2 className="t-h2 flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-success" aria-hidden />
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
            <article className="grid sm:grid-cols-[96px_minmax(0,1fr)] gap-x-6 gap-y-1 p-6 bg-card">
              <p className="text-xs font-medium text-primary pt-1">{TYPE_LABEL[exp.type]}</p>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="t-h3">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
                </div>
                <p className="text-sm text-foreground/80">{exp.company}</p>
                <ul className="space-y-2 mt-3">
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

      <h2 className="t-h2 mb-6">Before this</h2>
      {/*
        The line draws down as you scroll (components/motion/timeline.tsx).
        Year groups, cards, and the skills block are view-transition
        boundaries with only `update` on, so opening "+n more" makes
        everything below glide down instead of jumping.
      */}
      <TimelineTrack className="ml-3 md:ml-6 space-y-12 pb-2">
        {years.map((year) => (
          <ViewTransition key={year} update="displaced" default="none">
          <div>
            {/* -13px: half the 24px dot plus half the 2px track, so the dot centres on the line. */}
            <div className="flex items-center gap-4 mb-4 -ml-[13px]">
              <TimelineDot className="w-6 h-6 rounded-full bg-primary flex-shrink-0" />
              <span className="t-h2">{year}</span>
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
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="eyebrow mb-4">Technical Skills</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((group) => (
            <div key={group.label}>
              <h3 className="t-h3 mb-2">{group.label}</h3>
              <p className="text-sm text-muted-foreground">{group.items.join(" · ")}</p>
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
    <li className="text-sm text-foreground/80 flex items-start gap-2">
      <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
      <span>
        {/* The keyword is set in mono so it reads as a label, not just bold prose.
            13px is the one documented size exception: 13px mono optically matches 14px Inter. */}
        <span className="font-mono text-[13px] text-foreground">{highlight.lead}</span>
        <span className="text-muted-foreground"> / </span>
        {highlight.text}
      </span>
    </li>
  )
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const visible = experience.highlights.slice(0, VISIBLE_HIGHLIGHTS)
  const folded = experience.highlights.slice(VISIBLE_HIGHLIGHTS)

  return (
    <article className="p-6 rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
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
      <ul className="space-y-2">
        {visible.map((highlight) => (
          <HighlightItem key={highlight.lead} highlight={highlight} />
        ))}
      </ul>
      {folded.length > 0 && (
        <Expander label={`+${folded.length} more`}>
          <ul className="space-y-2 mt-2">
            {folded.map((highlight) => (
              <HighlightItem key={highlight.lead} highlight={highlight} />
            ))}
          </ul>
        </Expander>
      )}
      {experience.certificate && (
        <div className="mt-3">
          <a
            href={experience.certificate}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Award className="w-3.5 h-3.5" aria-hidden />
            Certificate
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}
    </article>
  )
}
