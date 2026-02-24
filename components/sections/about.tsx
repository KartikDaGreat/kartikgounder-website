import { Download, Github, Linkedin, Mail } from "lucide-react"

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
          The magic of software is something I view as inevitable. 
          I build on the shoulders of giants, leveraging the incredible tools and frameworks made by the world. 
          I am tinkering with the latest in AI, cloud, and data science, not just to keep up, but to push the boundaries of what’s possible.
        </p>

        <p>
          I believe technical rigor is most powerful when paired with collaborative curiosity.
        </p>
        <p>
          Also I kinda like iced mochas, running/gyming a bit and playing tennis once in a while.
        </p>

        <p>
          I thrive at the junction of logic and life, constantly seeking opportunities to solve meaningful problems through purpose-driven technology <br /> <span style={{ fontSize: "small", color: "lightblue" }}><a href="https://www.cs.columbia.edu/~cs4252/" target="_blank" rel="noopener noreferrer">(if I am not crying at Computational Learning Theory by Prof. Rocco).</a></span>
        </p>
      </div>

      {/* Skills */}
      <div className="mt-8 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">Top Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["Project Development", "AI/ML", "Healthcare Tech","LLMs and Fine-tuning"].map((skill) => (
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
          href="mailto:hello@kartikgounder.com"
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Email"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a
          href="https://drive.google.com/file/d/1RDCJcs4V8BLVaDjqGEFXjoqk6KzF-AXi/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-sm font-medium flex items-center gap-1 hover:bg-secondary/80 transition-colors border border-border"
          aria-label="Download Resume"
        >
          <Download className="w-4 h-4" />
          <span>Resume</span>
        </a>
      </div>
    </section>
  )
}
