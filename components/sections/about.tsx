import { Download, Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react"
import { GitHubStats } from "@/components/github-stats"

export function AboutSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Code-style greeting */}
      <div className="mb-8 font-mono text-sm text-muted-foreground">
        <span className="text-emerald-500">~/kartik</span>
        <span className="text-muted-foreground/60"> $ </span>
        <span className="text-foreground">whoami</span>
      </div>

      {/* Hero block: name, title, links */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Kartik Gounder</h1>
        <p className="text-xl text-primary font-medium mb-3">Software engineer who ships production systems</p>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            New York, NY
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            open to opportunities
          </span>
        </div>
        <p className="text-muted-foreground mt-2">
          MS in Computer Science @ Columbia University. Currently building at Vertex Inc. and Columbia aiX Lab.
        </p>

        {/* Social links + resume, right under the intro */}
        <div className="flex items-center gap-3 mt-4">
          <a
            href="https://github.com/KartikDaGreat"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/kartik-gounder"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:hello@kartikgounder.com"
            className="p-2.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <div className="w-px h-6 bg-border mx-1" />
          <a
            href="https://drive.google.com/file/d/1RDCJcs4V8BLVaDjqGEFXjoqk6KzF-AXi/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
            aria-label="Download Resume"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
        </div>
      </div>

      <div className="space-y-5 text-foreground/90 leading-relaxed">
        <blockquote className="border-l-2 border-primary/60 pl-4 italic text-muted-foreground py-1">
          {'"First, solve the problem. Then, write the code." – John Johnson'}
        </blockquote>

        <p>
          I like problems where the answer has to actually run: in production, on real data, with real
          users waiting. Right now that's the MCP platform at Vertex, which gives AI agents working
          access to 105 enterprise tools, and Sherlock, an internal bug-tracing system that cut developer
          debugging time by a couple of hours per issue. Before that it was TAOL, a middleware layer built
          around a question I kept running into: can you trust the code an AI agent just wrote? Turns out
          you can predict it, with 99.2% accuracy across 500 SWE-bench tasks.
        </p>

        <p>
          My range runs from hardware to research. I've built smart glasses for the visually impaired
          with 3D-printed parts for about $135, which turned into two filed patents, and published three
          peer-reviewed papers along the way. At Columbia's aiX lab, I design evaluation metrics for
          data-science agents and teach AI literacy to 30+ students. The Systems tab on this site runs
          on a Raspberry Pi and an Arduino sitting on my desk.
        </p>

        <p className="text-sm text-muted-foreground font-mono">
          {"// also: iced mochas, running, tennis, and the occasional gym session"}
        </p>
      </div>

      {/* What I do: outcomes, not skill tags */}
      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">What I do</h2>
        <div className="space-y-2.5 text-sm text-foreground/90">
          <p><span className="font-medium text-foreground">Production systems.</span> Enterprise integration platforms, internal AI tooling, and CI/CD pipelines that ship on schedule.</p>
          <p><span className="font-medium text-foreground">AI you can trust.</span> Agent orchestration, evaluation pipelines, and risk scoring for generated code.</p>
          <p><span className="font-medium text-foreground">Hardware to cloud.</span> Smart glasses I 3D-printed for $135, a Pi server in my apartment, bias-evaluation pipelines on GCP.</p>
          <p><span className="font-medium text-foreground">Research that ships.</span> Three peer-reviewed papers and two filed patents, all from things I actually built.</p>
        </div>
      </div>

      {/* Currently working on */}
      <div className="mt-6 p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Currently</span>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-foreground/80">Building MCP platform @ <span className="font-medium text-foreground">Vertex Inc.</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-foreground/80">AI literacy research @ <span className="font-medium text-foreground">Columbia aiX Lab</span></span>
          </div>
        </div>
      </div>

      {/* GitHub Stats */}
      <GitHubStats />
    </section>
  )
}
