import Link from "next/link"
import { Art } from "@/components/art"
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react"
import { GitHubStats } from "@/components/github-stats"
import { Reveal } from "@/components/motion/reveal"

// The receipts, ordered by how much value each one actually produced.
// Every number already lives elsewhere on this site.
const proof = [
  {
    value: "2-2.5h",
    label: "cut off every bug I trace at Vertex",
    where: "Vertex · Sherlock",
    detail: "An AI tracer that checks a reported bug against Datadog logs and Pulsar events before anyone opens an editor.",
  },
  {
    value: "13%",
    label: "revenue lift I drove across 15 clients",
    where: "eNova · AI modules",
    detail: "Scaled three prediction modules across the Python products, tuned against 15 real client deployments.",
  },
  {
    value: "36.11%",
    label: "fewer tokens on every agent request",
    where: "Vertex · MCP platform",
    detail: "Instrumented every tool-discovery call first, then cut the context that measurement proved redundant.",
  },
  {
    value: "3 + 2",
    label: "papers published, patents filed",
    where: "ACM · Springer · IEEE",
    detail: "Three peer-reviewed papers, plus two patents out of $135 of wearable hardware I built and ran.",
  },
]

const currently = [
  {
    dot: "bg-emerald-400",
    label: "Vertex Inc.",
    detail: "MCP platform connecting AI agents to 105 enterprise tools across 10 providers, 36.11% leaner on tokens",
  },
  {
    dot: "bg-blue-400",
    label: "Columbia aiX Lab",
    detail: "Evaluation metrics for data-science agents, plus AI literacy tooling",
  },
]

const threads = [
  {
    heading: "Can you trust what an agent just wrote?",
    body: "TAOL scores every LLM-generated patch on four risk signals and routes it to auto-apply, human review, or defer. The ambiguity classifier hits 99.2% accuracy across 500 SWE-bench tasks. Turns out you can predict trustworthiness. You just have to measure the right thing, and an ablation study is what tells you which thing that is.",
    href: "/projects/taol",
    linkLabel: "Read the build",
  },
  {
    heading: "What if privacy were structural instead of procedural?",
    body: "UrbanistAI blurs faces and text before an image ever reaches storage, using three face detectors in a union ensemble because a false positive costs an over-blurred photo and a false negative costs someone's face. There is no code path that stores an unprocessed upload.",
    href: "/projects/urbanistai",
    linkLabel: "Read the build",
  },
  {
    heading: "How cheap can assistive hardware get?",
    body: "Smart glasses for the visually impaired, 3D-printed parts, about $135 in materials. Sensor fusion for distance estimation and context-adaptive keyframe selection so the thing isn't burning compute on redundant frames. Two filed patents came out of it.",
    href: "#research",
    linkLabel: "See the patents",
  },
]

/**
 * Section links must be plain anchors so they fire hashchange; route links
 * go through next/link for client-side navigation.
 */
function ThreadLink({ href, label }: { href: string; label: string }) {
  const className =
    "inline-flex items-center gap-1.5 mt-2.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
  const content = (
    <>
      {label}
      <ArrowRight className="w-3.5 h-3.5" />
    </>
  )

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}

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
          I build AI agent infrastructure at Vertex, and I'm finishing my MS in Computer Science at Columbia.
          The problems I like are the ones where the answer has to actually run: on real data, on real
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

      {/* Proof strip: the numbers a recruiter skims for, without the reading */}
      <div className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {proof.map((stat) => (
          <div
            key={stat.label}
            tabIndex={0}
            aria-label={`${stat.value} ${stat.label}. ${stat.where}: ${stat.detail}`}
            className="flip bg-card h-[124px] outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          >
            <div className="flip-inner">
              <div className="flip-face bg-card px-4 py-3.5 flex flex-col justify-center">
                <div className="font-heading text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-[11px] leading-tight text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
              <div className="flip-face flip-back bg-card px-4 py-3 flex flex-col justify-center">
                <div className="text-[10px] font-mono uppercase tracking-wider text-primary">{stat.where}</div>
                <p className="text-[11px] leading-snug text-muted-foreground mt-1.5">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rule-accent mb-10" />

      {/* Three questions I've been chasing */}
      <div className="mb-12">
        <h2 className="eyebrow mb-1.5">
          <span className="eyebrow-index">01 / </span>What I've been chasing
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
          Most of my work starts as a question I couldn't stop poking at. Three that turned into something:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {threads.map((thread, i) => (
            <Reveal
              key={thread.heading}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
            >
              <span className="font-mono text-xs text-muted-foreground/60 mb-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-base md:text-lg font-semibold mb-2 tracking-tight leading-snug text-balance">
                {thread.heading}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{thread.body}</p>
              <div className="mt-auto pt-1">
                <ThreadLink href={thread.href} label={thread.linkLabel} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* How I work */}
      <div className="mb-12">
        <h2 className="eyebrow mb-1.5">
          <span className="eyebrow-index">02 / </span>How I work
        </h2>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {[
            {
              title: "Measure before you claim",
              line: "Instrumented every tool-discovery call at Vertex before touching a prompt. That's where the 36.11% token cut came from.",
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

      {/* Currently */}
      <div className="mb-12 p-5 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="eyebrow">Currently</span>
        </div>
        <div className="space-y-3">
          {currently.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5 text-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse mt-1.5 flex-shrink-0`} />
              <span className="text-foreground/80">
                <span className="font-semibold text-foreground">{item.label}</span>: {item.detail}
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground font-mono mt-4 pt-3 border-t border-border">
          {"// off-hours: iced mochas, running, tennis, and whatever's half-built on my desk"}
        </p>
      </div>

      {/* GitHub Stats */}
      <GitHubStats />
    </section>
  )
}
