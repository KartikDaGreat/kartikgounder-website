import Link from "next/link"
import { Art } from "@/components/art"
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react"
import { getProjectBySlug } from "@/lib/projects"
import { now, proof, recently } from "@/lib/profile"
import { GitHubStats } from "@/components/github-stats"
import { FlipCard } from "@/components/flip-card"
import { Reveal } from "@/components/motion/reveal"

// Hand-picked, with the one number that best says what each project does.
// The metric index skips numbers already shown in the proof strip above.
const selected: { slug: string; metric: number }[] = [
  { slug: "boxr", metric: 2 },
  { slug: "skill-optimizer", metric: 0 },
  { slug: "taol", metric: 0 },
  { slug: "urbanistai", metric: 1 },
]

const selectedProjects = selected.flatMap(({ slug, metric }) => {
  const project = getProjectBySlug(slug)
  if (!project) return []
  const [name, tagline] = project.title.split(/:\s+/, 2)
  return [{ slug, name, tagline: tagline ?? project.description, metric: project.metrics?.[metric] }]
})


export function AboutSection() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Code-style greeting */}
      <div className="mb-8 font-mono text-sm text-muted-foreground">
        <span className="text-emerald-500">~/kartik</span>
        <span className="text-muted-foreground/60"> $ </span>
        <span className="text-foreground">whoami</span>
      </div>

      {/* Hero */}
      <div className="mb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:items-center">
        <div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.08] text-balance">
          I build systems that <span className="text-primary">survive contact with production</span>.
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl text-pretty">
          I'm finishing my MS in Computer Science at Columbia. The problems I like are the ones where the answer has to actually run: on real data, on real
          hardware, with real users waiting.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-5 text-muted-foreground text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            New York, NY
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            graduating Dec 2026 · open to roles
          </span>
        </div>

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

        {/* Workshop line art, desktop only so the copy stays first on mobile */}
        <div className="hidden lg:block">
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
      <div className="mb-10 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
            <span className="relative flex w-2 h-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60 motion-reduce:hidden" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            Right now
          </h2>
          <span className="text-xs text-muted-foreground">Fall 2026, New York</span>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {now.map((item) => (
            <div key={item.role} className="p-5">
              <p className="text-xs font-medium text-primary mb-2">{item.kind}</p>
              <h3 className="font-heading text-lg font-bold tracking-tight leading-snug">{item.role}</h3>
              <p className="text-sm text-foreground/80 mt-0.5">{item.org}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proof strip: the numbers a recruiter skims for, without the reading */}
      <div className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {proof.map((stat) => (
          <FlipCard
            key={stat.label}
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
          {[
            {
              title: "Measure before you claim",
              line: "Instrumented every tool-discovery call at Vertex before touching a prompt. That is where the 36.11% token cut came from.",
            },
            {
              title: "Tests are how you go fast",
              line: "78 tests at Vertex, 144 on TAOL. A suite that catches regressions is what lets you keep changing things.",
            },
            {
              title: "Hardware keeps you honest",
              line: "The Pi and Arduino on my desk report live into this site. When they go down, you watch them go down.",
            },
            {
              title: "Research should ship",
              line: "Three papers and two patents, every one from an artifact I actually built and ran.",
            },
          ].map((principle) => (
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
            <Reveal key={event.title} className="grid sm:grid-cols-[88px_minmax(0,1fr)] gap-x-6 gap-y-1">
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
            </Reveal>
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
