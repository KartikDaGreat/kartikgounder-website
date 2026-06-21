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

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Kartik Gounder</h1>
        <p className="text-xl text-primary font-medium">Software Engineer & ML Researcher</p>
        <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            New York, NY
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            open to opportunities
          </span>
        </div>
        <p className="text-muted-foreground mt-2">
          MS in Computer Science @ Columbia | Building at Vertex Inc. & Columbia aiX
        </p>
      </div>

      <div className="space-y-5 text-foreground/90 leading-relaxed">
        <blockquote className="border-l-2 border-primary/60 pl-4 italic text-muted-foreground py-1">
          {'"First, solve the problem. Then, write the code." – John Johnson'}
        </blockquote>

        <p>
          I build systems that work: from production-grade MCP platforms connecting 100+ enterprise tools
          to trust-aware AI orchestration layers with 99.2% ambiguity detection. I care about shipping
          reliable software, writing tests that matter, and making infrastructure that scales.
        </p>

        <p>
          My work spans full-stack development, ML/AI pipelines, and developer tooling.
          I believe the best engineering happens at the intersection of deep technical rigor
          and genuine curiosity about how things should work.
        </p>

        <p className="text-sm text-muted-foreground font-mono">
          {"// also: iced mochas, running, tennis, and the occasional gym session"}
        </p>
      </div>

      {/* Top Skills */}
      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Strengths</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Full-Stack Development",
            "AI/ML Systems",
            "Developer Tooling",
            "Cloud & Infrastructure",
            "Testing & Quality",
          ].map((skill) => (
            <span key={skill} className="px-3 py-1.5 text-sm font-mono bg-secondary text-secondary-foreground rounded-md border border-border">
              {skill}
            </span>
          ))}
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

      {/* Social links */}
      <div className="flex items-center gap-3 mt-8 pt-8 border-t border-border">
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
    </section>
  )
}
