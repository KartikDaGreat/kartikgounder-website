import type { CSSProperties } from "react"
import { ViewTransition } from "react"
import Link from "next/link"
import { Art } from "@/components/art"
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, Terminal } from "lucide-react"
import { getProjectBySlug } from "@/lib/projects"
import { now, principles, proof, recently } from "@/lib/profile"
import { GitHubStats } from "@/components/github-stats"
import { FlipCard } from "@/components/flip-card"
import { IntroGate } from "@/components/motion/intro-gate"

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


export function AboutSection() {
  return (
    <section>
      <IntroGate />

      {/* whoami, and its output: who I am and whether I'm available, which is
          the first thing a visitor needs. The command types, the output prints. */}
      <div className="mb-8 font-mono text-sm text-muted-foreground">
        <p>
          <span className="text-emerald-500">~/kartik</span>
          <span className="text-muted-foreground/60"> $ </span>
          <span className="relative text-foreground">
            <span className="intro-type inline-block">whoami</span>
            <span className="intro-caret absolute left-full top-[0.1em]" aria-hidden />
          </span>
        </p>
        <p className="intro-output mt-1.5 text-foreground/90 leading-relaxed">
          <span className="font-semibold text-foreground">Kartik Gounder</span>. MS CS at Columbia, New York.{" "}
          <span className="text-emerald-500">Graduating Dec 2026, open to full-time roles.</span>
        </p>
      </div>

      {/* Hero */}
      <div className="mb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:items-center">
        <div>
        {/* Set as its four natural lines, each masked and rising from its own
            baseline. Each line fits on one line from a phone up to desktop. */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.08]">
          <span className="intro-line">
            <span style={stagger(0)}>I build systems</span>
          </span>
          <span className="intro-line">
            <span style={stagger(1)}>
              that <span className="text-primary">survive</span>
            </span>
          </span>
          <span className="intro-line">
            <span className="text-primary" style={stagger(2)}>
              contact with
            </span>
          </span>
          <span className="intro-line">
            <span style={stagger(3)}>
              <span className="text-primary">production</span>.
            </span>
          </span>
        </h1>

        {/* Everything a visitor acts on fades in together and never moves. */}
        <div className="intro-after-headline">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl text-pretty">
          The problems I like are the ones where the answer has to actually run: on real data, on real hardware, with
          real users waiting.
        </p>

        {/* CTAs */}
        {/*
          Plain anchors, not next/link: a Link to a same-page hash uses
          pushState, which never fires hashchange, so the section would not
          actually switch.
        */}
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            See what I've built
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#terminal"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            Poke at the shell
          </a>
          <a
            href="https://drive.google.com/file/d/1RDCJcs4V8BLVaDjqGEFXjoqk6KzF-AXi/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-1 mt-5 -ml-2.5">
          <a
            href="https://github.com/KartikDaGreat"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/kartik-gounder"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:hello@kartikgounder.com"
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
        </div>
        </div>

        {/* Workshop line art, desktop only so the copy stays first on mobile */}
        <div className="intro-art hidden lg:block">
          <Art
            src="/art/hero-workshop.png"
            alt="Line illustration of a builder's desk: laptop, LED matrix, microcontroller, and tangled wires"
            width={1408}
            height={768}
            className="w-full"
          />
        </div>
      </div>

      {/* Right now: the three current roles, promoted from the old footer box
          because they are the first thing a visitor should learn. */}
      {/* The intro's one bold moment: the dot lights once, then the roles
          fill in, Industry first. Each role morphs into its row on Building. */}
      <div className="intro-now mb-10 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
            <span className="relative flex w-2 h-2" aria-hidden>
              <span className="intro-now-ping absolute inset-0 rounded-full bg-emerald-400 opacity-0" />
              <span className="intro-now-dot relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            Right now, Fall 2026
          </h2>
          {/* Plain anchor so the hash change switches sections (see page.tsx). */}
          <a href="#work" className="text-xs font-medium text-primary hover:underline underline-offset-4">
            See all roles
          </a>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {now.map((item, i) => (
            <ViewTransition key={item.id} name={`role-${item.id}`} share="role-morph" default="none">
              <div className="intro-now-item p-5 bg-card" style={stagger(i)}>
                <p className="text-xs font-medium text-primary mb-2">{item.kind}</p>
                <h3 className="font-heading text-lg font-bold tracking-tight leading-snug">{item.role}</h3>
                <p className="text-sm text-foreground/80 mt-0.5">{item.org}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.detail}</p>
              </div>
            </ViewTransition>
          ))}
        </div>
      </div>

      {/* Proof strip: the numbers a recruiter skims for, without the reading */}
      <div className="intro-proof mb-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {proof.map((stat, i) => (
          <div key={stat.label} style={stagger(i)}>
          <FlipCard
            label={`${stat.value} ${stat.label}. ${stat.where}: ${stat.detail}`}
            className="h-[150px] sm:h-[132px] lg:h-[124px]"
            front={
              <>
                <div className="font-heading text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-[11px] leading-tight text-muted-foreground mt-0.5">{stat.label}</div>
              </>
            }
            back={
              <>
                <div className="text-[10px] font-mono uppercase tracking-wider text-primary">{stat.where}</div>
                <p className="text-[11px] leading-snug text-muted-foreground mt-1.5">{stat.detail}</p>
              </>
            }
          />
          </div>
        ))}
      </div>

      {/* Selected work: one line and one number per project, the detail lives on each page */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="font-heading text-xl font-bold tracking-tight">Selected work</h2>
          <a href="#projects" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            All projects
          </a>
        </div>
        <ul className="border-t border-border">
          {selectedProjects.map((project) => (
            <li key={project.slug} className="border-b border-border">
              <Link
                href={`/projects/${project.slug}`}
                transitionTypes={["nav-forward"]}
                className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_200px_auto] items-center gap-x-6 gap-y-1 py-4 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
              >
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-bold tracking-tight group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-snug mt-0.5">{project.tagline}</p>
                </div>
                {project.metric && (
                  <div className="hidden sm:block">
                    <div className="font-heading text-lg font-bold leading-none">{project.metric.value}</div>
                    <div className="text-xs text-muted-foreground leading-snug mt-1">{project.metric.label}</div>
                  </div>
                )}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* How I work */}
      <div className="mb-12">
        <h2 className="font-heading text-xl font-bold tracking-tight">How I work</h2>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="border-l-2 border-primary/40 pl-4 py-1"
            >
              <h3 className="font-semibold text-[15px] mb-0.5">{principle.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{principle.line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently */}
      <div className="mb-12">
        <h2 className="font-heading text-xl font-bold tracking-tight mb-5">Recently</h2>
        <div className="space-y-6">
          {recently.map((event) => (
            <div key={event.title} className="grid sm:grid-cols-[88px_minmax(0,1fr)] gap-x-6 gap-y-1">
              <span className="font-mono text-xs text-muted-foreground pt-1">{event.when}</span>
              <div className="border-l-2 border-primary/40 pl-4">
                <h3 className="font-semibold text-[15px] mb-2">{event.title}</h3>
                <div className="space-y-2 max-w-2xl">
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

      <p className="mb-12 text-sm text-muted-foreground font-mono">
        {"// off-hours: iced mochas, running, tennis, and whatever's half-built on my desk"}
      </p>

      {/* GitHub Stats */}
      <GitHubStats />
    </section>
  )
}
