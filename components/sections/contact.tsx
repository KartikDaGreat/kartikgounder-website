import { Mail, Github, Linkedin, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact</h1>
        <p className="text-muted-foreground">
          I'm looking for SWE and AI infrastructure roles, especially anything involving agentic systems, developer tooling, or hard deployment problems. If you're working on something interesting, I'd like to hear about it.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Get in Touch</h2>
          <div className="grid gap-3">
            <a
              href="mailto:kartikgounder@gmail.com"
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">kartikgounder@gmail.com</p>
                <p className="text-sm text-muted-foreground">Personal inbox</p>
              </div>
            </a>
            <a
              href="mailto:hello@kartikgounder.com"
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">hello@kartikgounder.com</p>
                <p className="text-sm text-muted-foreground">Portfolio & collaborations</p>
              </div>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground px-1">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">New York, New York, United States</span>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Find Me Online</h2>
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
                <p className="text-sm text-muted-foreground">@KartikDaGreat</p>
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
          </div>
        </div>
      </div>
    </section>
  )
}
