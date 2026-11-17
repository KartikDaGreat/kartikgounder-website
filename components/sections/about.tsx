import type { CSSProperties } from "react"
import { ViewTransition } from "react"
import Link from "next/link"
import { Art } from "@/components/art"
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Terminal } from "lucide-react"
import { getProjectBySlug } from "@/lib/projects"
import { basics, now, principles, proof, recently } from "@/lib/profile"
import { GitHubStats } from "@/components/github-stats"
import { FlipCard } from "@/components/flip-card"
import { IntroGate } from "@/components/motion/intro-gate"
import { Tip } from "@/components/tip"

// Hand-picked, with the one number that best says what each project does.
// The metric index skips numbers already shown in the proof strip above.
const selected: { slug: string; metric: number }[] = [
  { slug: "boxr", metric: 2 },
  { slug: "skill-optimizer", metric: 0 },
  { slug: "taol", metric: 0 },
  { slug: "urbanistai", metric: 1 },
]

/** Stagger index for the intro keyframes in globals.css. */
const stagger = (i: number) => ({ "--i": i }) as CSSProperties

const selectedProjects = selected.flatMap(({ slug, metric }) => {
  const project = getProjectBySlug(slug)
  if (!project) return []
  const [name, tagline] = project.title.split(/:\s+/, 2)
  return [{ slug, name, tagline: tagline ?? project.description, metric: project.metrics?.[metric] }]
})

const socials = [
  { href: basics.github, label: "GitHub", Icon: Github, external: true },
  { href: basics.linkedin, label: "LinkedIn", Icon: Linkedin, external: true },
  { href: `mailto:${basics.email}`, label: "Email", Icon: Mail, external: false },
]

type Metric = { value: string; label: string } | undefined

/** One row of Selected work. The metric sits under the tagline on phones and in its own column from `sm`. */
function WorkRow({ name, tagline, metric }: { name: string; tagline: string; metric: Metric }) {
  return (
    <>
      <div className="col-start-1 row-start-1 min-w-0">
        <h3 className="t-h3 font-heading group-hover:text-primary transition-colors duration-150">{name}</h3>
        <p className="text-sm text-muted-foreground leading-snug mt-1">{tagline}</p>
      </div>
      {metric && (
        <p className="t-meta col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 sm:font-sans">
          <span className="font-heading font-semibold tabular-nums text-foreground sm:block sm:text-lg sm:leading-none">
            {metric.value}
          </span>{" "}
          <span className="sm:block sm:mt-1 sm:leading-snug">{metric.label}</span>
        </p>
      )}
      <ArrowUpRight
        aria-hidden
        className="col-start-2 row-span-2 row-start-1 self-center size-4 text-muted-foreground group-hover:text-primary transition-colors duration-150 sm:col-start-3 sm:row-span-1"
      />
    </>
  )
}

const workRowClass =
  "group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_200px_auto] items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6 hover:bg-secondary/50 transition-colors duration-150 focus-visible:-outline-offset-2"

export function AboutSection() {
  return (
    <section>
      <IntroGate />

      {/* whoami, and its output: who I am and whether I'm available, which is
          the first thing a visitor needs. The command types, the output prints. */}
      <div className="mb-6 font-mono text-sm text-muted-foreground">
        <p>
          <span>~/kartik</span>
          <span> $ </span>
          <span className="relative text-foreground">
            <span className="intro-type inline-block">whoami</span>
            <span className="intro-caret absolute left-full top-[0.1em]" aria-hidden />
          </span>
        </p>
        <p className="intro-output mt-2 text-foreground/90 leading-relaxed">
          <span className="font-semibold text-foreground">{basics.name}</span>. MS CS at Columbia, New York.{" "}
          <span className="text-success">Graduating Dec 2026, open to full-time roles.</span>
        </p>
      </div>

      {/* Hero. The outer element is the query container and the grid sits
          inside it: an element cannot query its own size, so `@3xl:` on the
          container itself would never match. The art column appears only once
          the content area is at least 48rem wide, whatever the viewport. */}
      <div className="@container mb-12">
        <div className="grid gap-12 @3xl:grid-cols-[minmax(0,1fr)_280px] @3xl:items-center">
          {/* Its own container, so `.t-display` (sized in cqi) follows the
              width of the column the headline actually sits in. */}
          <div className="@container min-w-0">
            {/* Set as its three natural lines, each masked and rising from its
                own baseline. A line too long for its column wraps, never clips. */}
            <h1 className="t-display mb-4">
              <span className="intro-line">
                <span style={stagger(0)}>I build systems</span>
              </span>
              <span className="intro-line">
                <span style={stagger(1)}>that survive</span>
              </span>
              <span className="intro-line">
                <span style={stagger(2)}>
                  in <span className="text-primary">production</span>.
                </span>
              </span>
            </h1>

            {/* Everything a visitor acts on fades in together and never moves. */}
            <div className="intro-after-headline">
              <p className="t-lede">
                The problems I like are the ones where the answer has to actually run: on real data, on real
                hardware, with real users waiting.
              </p>

              {/*
                Plain anchors, not next/link: a Link to a same-page hash uses
                pushState, which never fires hashchange, so the section would not
                actually switch.
              */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-primary">
                  See what I've built
                  <ArrowRight aria-hidden className="size-4" />
                </a>
                <a href={basics.resume} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Resume
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
                <ul className="flex items-center" aria-label="Elsewhere">
                  {socials.map(({ href, label, Icon, external }) => (
                    <li key={label}>
                      <Tip label={label}>
                        <a
                          href={href}
                          aria-label={label}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
                        >
                          <Icon aria-hidden className="size-5" />
                        </a>
                      </Tip>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#terminal"
                className="t-meta mt-4 inline-flex min-h-11 items-center gap-2 hover:text-foreground transition-colors duration-150"
              >
                <Terminal aria-hidden className="size-4" />
                or poke at the shell
              </a>
            </div>
          </div>

          {/* Workshop line art, only when there is room so the copy stays first */}
          <div className="intro-art hidden @3xl:block">
            <Art
              src="/art/hero-workshop.png"
              alt="Line illustration of a builder's desk: laptop, LED matrix, microcontroller, and tangled wires"
              width={1408}
              height={768}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Proof strip: the numbers a recruiter skims for. The source is on the
          front; the back holds the one-line detail. */}
      <div className="intro-proof mb-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-xl border border-border bg-border overflow-hidden">
        {proof.map((stat, i) => (
          <div key={stat.label} style={stagger(i)}>
            <FlipCard
              label={`${stat.value} ${stat.label}. ${stat.where}: ${stat.detail}`}
              className="h-40 sm:h-36 lg:h-32"
              front={
                <>
                  <div className="font-heading text-2xl font-semibold tabular-nums">{stat.value}</div>
                  <div className="text-sm leading-snug text-muted-foreground">{stat.label}</div>
                  <div className="t-meta mt-2">{stat.where}</div>
                </>
              }
              back={<p className="text-xs sm:text-sm leading-snug text-muted-foreground">{stat.detail}</p>}
            />
          </div>
        ))}
      </div>

      {/* Selected work: one line and one number per project, the detail lives on each page */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="t-h2 font-heading">Selected work</h2>
          <a href="#projects" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            All projects
          </a>
        </div>
        <ul className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {selectedProjects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} transitionTypes={["nav-forward"]} className={workRowClass}>
                <WorkRow name={project.name} tagline={project.tagline} metric={project.metric} />
              </Link>
            </li>
          ))}
          <li>
            {/* Plain anchor so the hash change switches sections (see page.tsx). */}
            <a href="#research" className={workRowClass}>
              <WorkRow
                name="Research"
                tagline="Three peer-reviewed papers across ACM, Springer, and IEEE, and two patent applications."
                metric={proof[3]}
              />
            </a>
          </li>
        </ul>
      </div>

      {/* Right now: the three current roles. Each role morphs into its row on Work. */}
      <div className="intro-now mb-12 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-border">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
            <span className="intro-now-dot size-2 rounded-full bg-success" aria-hidden />
            Right now, Fall 2026
          </h2>
          {/* Plain anchor so the hash change switches sections (see page.tsx). */}
          <a
            href="#work"
            className="inline-flex min-h-11 items-center text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            See all roles
          </a>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {now.map((item, i) => (
            <ViewTransition key={item.id} name={`role-${item.id}`} share="role-morph" default="none">
              <div className="intro-now-item p-6 bg-card" style={stagger(i)}>
                <p className="eyebrow mb-2">{item.kind}</p>
                <h3 className="font-heading text-lg font-semibold tracking-tight leading-snug">{item.role}</h3>
                <p className="text-sm text-foreground/80 mt-1">{item.org}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.detail}</p>
              </div>
            </ViewTransition>
          ))}
        </div>
      </div>

      {/* How I work */}
      <div className="mb-12">
        <h2 className="t-h2 font-heading">How I work</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {principles.map((principle) => (
            <div key={principle.title} className="border-l-2 border-border pl-4 py-1">
              <h3 className="t-h3 mb-1">{principle.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{principle.line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently */}
      <div className="mb-12">
        <h2 className="t-h2 font-heading mb-4">Recently</h2>
        <div className="space-y-6">
          {recently.map((event) => (
            <div key={event.title} className="grid sm:grid-cols-[88px_minmax(0,1fr)] gap-x-6 gap-y-1">
              <span className="t-meta pt-1">{event.when}</span>
              <div className="border-l-2 border-border pl-4">
                <h3 className="t-h3 mb-2">{event.title}</h3>
                <div className="space-y-2 prose-measure">
                  {event.body.map((para) => (
                    <p key={para.slice(0, 24)} className="text-sm text-muted-foreground leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GitHubStats />

      <p className="text-sm text-muted-foreground font-mono">
        {"// off-hours: iced mochas, running, tennis, and whatever's half-built on my desk"}
      </p>

      {/* Closing call to action */}
      <section
        aria-labelledby="cta-h"
        className="mt-12 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8"
      >
        <div>
          <h2 id="cta-h" className="t-h2 font-heading">
            Let's talk
          </h2>
          <p className="mt-2 text-sm text-muted-foreground prose-measure">{basics.availability}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:shrink-0">
          <a href={`mailto:${basics.email}`} className="btn btn-primary">
            Email me
          </a>
          <a href="#contact" className="btn btn-secondary">
            All contact options
          </a>
        </div>
      </section>
    </section>
  )
}
