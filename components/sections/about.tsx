import { Github, Linkedin, Mail } from "lucide-react"

export function AboutSection() {
  return (
    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Kartik Gounder</h1>
        <p className="text-xl text-primary font-medium">Building Meaningful Technology</p>
        <p className="text-muted-foreground mt-2">
          MS in Computer Science @ Columbia | Technical Engineer & Data Analyst
        </p>
      </div>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
          {'"Why fit in when you were born to stand out?" – Dr. Seuss'}
        </blockquote>

        <p>
          This perfectly captures my career philosophy. I am passionate about building technology that makes a{" "}
          <span className="text-primary font-medium">real-world impact</span>, which has led me to explore domains
          beyond a typical CS curriculum. I am pursuing an MS in Computer Science at Columbia University with a focus on{" "}
          <span className="text-primary font-medium">AI</span>,{" "}
          <span className="text-primary font-medium">machine learning</span>, and{" "}
          <span className="text-primary font-medium">healthcare applications</span>.
        </p>

        <p>
          I have coded, developed and patented innovations in healthcare and assistive technology to take a step at
          competing in various domains alongside industry leaders. I have led technical workshops, hackathons, and
          collaborative software projects, while also mentoring teams in developing solutions like traffic speed
          detection systems and IoT-based health monitoring platforms.
        </p>

        <p>
          I thrive at the intersection of technology, healthcare, and AI-powered solutions, constantly seeking
          opportunities to solve meaningful problems and seek innovation that impacts people{"'"}s lives.
        </p>
      </div>

      {/* Skills */}
      <div className="mt-8 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">Top Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["People Management", "Arduino Uno", "Project Development", "AI/ML", "Healthcare Tech"].map((skill) => (
            <span key={skill} className="px-3 py-1 text-sm font-mono bg-secondary text-secondary-foreground rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="flex gap-4 mt-8 pt-8 border-t border-border">
        <a
          href="https://github.com/KartikDaGreat"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/kartik-gounder"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="mailto:kartikgounder@gmail.com"
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Email"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}
