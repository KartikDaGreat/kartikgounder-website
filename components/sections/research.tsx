import { ExternalLink, FileText, Award, ImageIcon } from "lucide-react"

interface Publication {
  title: string
  venue: string
  year: string
  authors: string
  link?: string
  type: "paper" | "patent"
  description?: string
}

const publications: Publication[] = [
  {
    title: "A Lightweight Hybrid CNN-Fuzzy Logic Approach for Real Time On-Device Document Classification",
    venue: "ISEC 2025 (ACM)",
    year: "2025",
    authors: "K. Gounder et al.",
    link: "#",
    type: "paper",
    description:
      "Samsung PRISM collaboration - Custom CNN framework with 3.7M parameters optimized for on-device deployment",
  },
  {
    title: "A Hybrid-Multimodal Mental Health Chatbot for Psychological Counselling",
    venue: "BITMDM-2024 (Springer)",
    year: "2024",
    authors: "K. Gounder et al.",
    link: "#",
    type: "paper",
    description: "3-modal chatbot system achieving 87% patient satisfaction rate for mental health assessment",
  },
  {
    title: "Ensemble Model using Various CNNs for Improved Skin Cancer Diagnosis",
    venue: "ICoICI-2024 (IEEE)",
    year: "2024",
    authors: "K. Gounder et al.",
    link: "#",
    type: "paper",
    description: "Ensemble of ResNet, EfficientNet, and MobileNet achieving 96.33% accuracy in early detection",
  },
]

const patents: Publication[] = [
  {
    title: "Sensor-Fused Object Distance Estimation And Visual Scaling For Wearable Electronic System",
    venue: "Patent Application",
    year: "2024",
    authors: "K. Gounder",
    type: "patent",
    description: "Novel approach for assistive wearables combining sensor fusion with visual distance estimation",
  },
  {
    title: "Multimodal Context-Adaptive Keyframe Selection System for Vision Assistive Wearables",
    venue: "Patent Application",
    year: "2024",
    authors: "K. Gounder",
    type: "patent",
    description: "Intelligent keyframe selection for vision assistance using multimodal context analysis",
  },
]

export function ResearchSection() {
  return (
    <section className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Research</h1>
      <p className="text-muted-foreground mb-12">Publications and patents in computer science and AI</p>

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Publications</h2>
            <p className="text-sm text-muted-foreground">Peer-reviewed research papers</p>
          </div>
        </div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <article
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image placeholder */}
                <div className="lg:w-72 h-48 lg:h-auto flex-shrink-0 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <span className="text-xs text-muted-foreground">Paper thumbnail</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs font-mono rounded bg-primary/10 text-primary">
                          {pub.venue}
                        </span>
                        <span className="text-xs text-muted-foreground">{pub.year}</span>
                      </div>
                      <h3 className="text-lg font-medium leading-snug mb-2 group-hover:text-primary transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{pub.authors}</p>
                    </div>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
                        aria-label="View publication"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {pub.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {pub.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Patents</h2>
            <p className="text-sm text-muted-foreground">Intellectual property filings</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {patents.map((patent, index) => (
            <article
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="h-36 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center border-b border-border">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <span className="text-xs text-muted-foreground">Patent diagram</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-secondary text-secondary-foreground">
                    Patent
                  </span>
                  <span className="text-xs text-muted-foreground">{patent.year}</span>
                </div>
                <h3 className="font-medium leading-snug mb-2 group-hover:text-primary transition-colors">
                  {patent.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{patent.authors}</p>
                {patent.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {patent.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
