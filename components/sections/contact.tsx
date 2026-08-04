import Image from "next/image"
import { Mail, Github, Linkedin, MapPin, FileJson } from "lucide-react"
import { Art } from "@/components/art"

export function ContactSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 sm:grid sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-8 sm:items-start">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Let's talk</h1>
          <p className="text-lg text-foreground/80 leading-relaxed text-pretty">
            <span className="font-semibold text-foreground">Graduating December 2026.</span> If you're building
            agentic systems, developer tooling, or evaluation, tell me what's broken on your side. I'd rather
            hear about the problem than the job description.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            If you've read one of the project pages and think I got something wrong, that's an even better email.
          </p>
        </div>

        {/*
          Unlike the line-art masks, this one ships opaque and carries its own
          paper. Stippling encodes brightness as ink density, so painting it in
          the palette's foreground over a dark background would render it as a
          photographic negative: dark hair bright, white shirt black. Framed as
          a print instead, it reads the same in all 54 palettes.
        */}
        <div className="mt-8 sm:mt-0 max-w-[240px]">
          <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
            <Image
              src="/art/portrait.png"
              alt="Stippled portrait of Kartik Gounder with the Manhattan skyline behind him"
              width={900}
              height={900}
              className="w-full rounded-sm"
            />
          </div>
          <p className="mt-2 text-[11px] font-mono text-muted-foreground text-center">
            {"// hi, that's me"}
          </p>
        </div>
      </div>

      <div className="rule-accent mb-10" />

      <div className="space-y-9">
        <div>
          <h2 className="eyebrow mb-4">Email</h2>
          <div className="grid gap-3">
            <a
              href="mailto:hello@kartikgounder.com"
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">hello@kartikgounder.com</p>
                <p className="text-sm text-muted-foreground">Best for work, collaborations, and this site</p>
              </div>
            </a>
            <a
              href="mailto:kartikgounder@gmail.com"
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">kartikgounder@gmail.com</p>
                <p className="text-sm text-muted-foreground">Personal inbox, also reliable</p>
              </div>
            </a>
          </div>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Elsewhere</h2>
          <div className="grid gap-2">
            <a
              href="https://github.com/KartikDaGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
            >
              <Github className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">GitHub</p>
                <p className="text-sm text-muted-foreground">@KartikDaGreat, including the source of this site</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/kartik-gounder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
            >
              <Linkedin className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">LinkedIn</p>
                <p className="text-sm text-muted-foreground">kartik-gounder</p>
              </div>
            </a>
            <a
              href="/api/resume"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
            >
              <FileJson className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">GET /api/resume</p>
                <p className="text-sm text-muted-foreground">
                  Machine-readable version, for the recruiters running scripts
                </p>
              </div>
            </a>
          </div>
        </div>

        <Art
          src="/art/contact-signal.png"
          alt="Line illustration of a radio tower broadcasting a signal across a city skyline"
          width={1584}
          height={672}
          className="w-full"
        />

        <div className="flex items-center gap-3 text-muted-foreground px-1">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">New York, New York. Open to relocating for the right team</span>
        </div>
      </div>
    </section>
  )
}
