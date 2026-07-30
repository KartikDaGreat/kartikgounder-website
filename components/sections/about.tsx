import Link from "next/link"
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react"
import { GitHubStats } from "@/components/github-stats"
import { Reveal } from "@/components/motion/reveal"

const currently = [
  {
    dot: "bg-emerald-400",
    label: "Vertex Inc.",
    detail: "MCP platform giving AI agents working access to 105 enterprise tools",
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
    body: "TAOL scores every LLM-generated patch on four risk signals and routes it to auto-apply, human review, or defer. The ambiguity classifier hits 99.2% accuracy across 500 SWE-bench tasks. Turns out you can predict trustworthiness — you just have to measure the right thing, and an ablation study is what tells you which thing that is.",
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
      <div className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
          I build systems that
          <br />
          have to survive contact
          <br />
          <span className="text-primary">with production.</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl">
          Kartik Gounder — software engineer, MS Computer Science at Columbia. I like the problems where the
          answer has to actually run: on real data, on real hardware, with real users waiting. Lately that's
          been AI agent infrastructure at Vertex and evaluation research at Columbia's aiX Lab.
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
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            See what I've built
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#terminal"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            Poke at the shell
          </Link>
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

      <div className="rule-accent mb-10" />

      {/* Three questions I've been chasing */}
      <div className="mb-12">
        <h2 className="eyebrow mb-1.5">
          <span className="eyebrow-index">01 / </span>What I've been chasing
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
          Most of my work starts as a question I couldn't stop poking at. Three that turned into something:
        </p>

        <div className="space-y-5">
          {threads.map((thread) => (
            <Reveal key={thread.heading} className="group border-l-2 border-border hover:border-primary/60 pl-5 py-1 transition-colors">
              <h3 className="text-lg md:text-xl font-semibold mb-1.5 tracking-tight">{thread.heading}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">{thread.body}</p>
              <Link
                href={thread.href}
                className="inline-flex items-center gap-1.5 mt-2.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
              >
                {thread.linkLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* How I work */}
      <div className="mb-12">
        <h2 className="eyebrow mb-1.5">
          <span className="eyebrow-index">02 / </span>How I work
        </h2>
        <div className="mt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <h3 className="font-semibold mb-1.5">Measure before you claim</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Vertex I instrumented every tool-discovery call before touching the prompt, then cut redundant
              context for a 36.11% token-efficiency gain. Same instinct behind TAOL's ablation study: knowing
              which signal is load-bearing beats knowing that the whole thing works.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1.5">Tests are how you go fast</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              78 tests across unit, integration, functional, and e2e layers at Vertex, at 92.65% coverage. 144 on
              TAOL. Not for the badge — because a suite that catches regressions is what lets you keep changing
              things without dread.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1.5">Hardware keeps you honest</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A Raspberry Pi file server and an Arduino on my desk both report into the Live Systems page on this
              site. Nothing is mocked. When the Pi goes down, you see it go down, which is a useful thing to have
              built into your own portfolio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1.5">Research should ship</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Three peer-reviewed papers (ACM, Springer, IEEE) and two filed patents, all of them from artifacts I
              actually built and ran — a 3.7M-parameter on-device classifier, a tri-modal counselling chatbot, a
              CNN ensemble at 96.33%.
            </p>
          </div>
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
                <span className="font-semibold text-foreground">{item.label}</span> — {item.detail}
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
