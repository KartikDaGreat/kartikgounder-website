import { Monitor, Code2, Terminal, Wrench, Coffee } from "lucide-react"

interface UseItem {
  name: string
  description: string
  url?: string
}

interface UseCategory {
  title: string
  icon: React.ElementType
  items: UseItem[]
}

const categories: UseCategory[] = [
  {
    title: "Editor & IDE",
    icon: Code2,
    items: [
      { name: "VS Code", description: "Primary editor with vim keybindings", url: "https://code.visualstudio.com" },
      { name: "Cursor", description: "AI-native IDE for faster prototyping", url: "https://cursor.sh" },
      { name: "JetBrains IntelliJ", description: "Java/Kotlin development", url: "https://www.jetbrains.com/idea/" },
      { name: "Theme: One Dark Pro", description: "Consistent across all editors" },
      { name: "Font: JetBrains Mono", description: "Ligatures enabled, 14px" },
    ],
  },
  {
    title: "Terminal & Shell",
    icon: Terminal,
    items: [
      { name: "Windows Terminal", description: "Primary terminal emulator" },
      { name: "Bash / Zsh", description: "Shell with oh-my-zsh" },
      { name: "Claude Code", description: "AI-powered CLI for development", url: "https://claude.ai" },
      { name: "Git", description: "Version control with conventional commits" },
      { name: "pnpm", description: "Fast, disk-efficient package manager" },
    ],
  },
  {
    title: "Development Tools",
    icon: Wrench,
    items: [
      { name: "Docker", description: "Containerized development and deployment" },
      { name: "Postman", description: "API testing and documentation" },
      { name: "Figma", description: "UI/UX design and prototyping", url: "https://figma.com" },
      { name: "Vercel", description: "Deployment and hosting for this site", url: "https://vercel.com" },
      { name: "GitHub Actions", description: "CI/CD pipelines" },
    ],
  },
  {
    title: "Hardware",
    icon: Monitor,
    items: [
      { name: "Custom PC", description: "Primary development machine, Windows 11" },
      { name: "Raspberry Pi 4", description: "Home server for file storage & APIs" },
      { name: "Arduino Uno", description: "IoT sensor projects and monitoring" },
      { name: "Dual Monitor Setup", description: "27\" + 24\" for productivity" },
    ],
  },
  {
    title: "Productivity",
    icon: Coffee,
    items: [
      { name: "Notion", description: "Notes, project management, knowledge base" },
      { name: "Arc Browser", description: "Primary browser with spaces", url: "https://arc.net" },
      { name: "Spotify", description: "Lo-fi beats while coding" },
      { name: "ChatGPT / Claude", description: "AI assistants for research and brainstorming" },
    ],
  },
]

export function UsesSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Uses</h1>
        <p className="text-muted-foreground">Tools, hardware, and software I use daily for development.</p>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          {"// inspired by uses.tech"}
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.title}
              </h2>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* This site's stack */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">This Site</h2>
        <div className="flex flex-wrap gap-2">
          {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Shadcn/ui", "Vercel", "Raspberry Pi", "Arduino"].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-md border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Features include an interactive terminal, live systems dashboard, visitor analytics, Arduino integration, and a donut finder.
          Source available on <a href="https://github.com/KartikDaGreat/kartikgounder-website" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
        </p>
      </div>
    </section>
  )
}
