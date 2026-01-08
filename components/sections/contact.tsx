import { Mail, Github, Linkedin, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact</h1>
      <p className="text-muted-foreground mb-12">{"Let's connect and collaborate"}</p>

      <div className="space-y-8">
        {/* Email */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Get in Touch</h2>
          <a
            href="mailto:kartikgounder@gmail.com"
            className="inline-flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all group"
          >
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">kartikgounder@gmail.com</p>
              <p className="text-sm text-muted-foreground">Open for opportunities and collaborations</p>
            </div>
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">New York, New York, United States</span>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Find Me Online</h2>
          <div className="grid gap-3">
            <a
              href="https://github.com/KartikDaGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
            >
              <Github className="w-5 h-5" />
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
              <Linkedin className="w-5 h-5" />
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
