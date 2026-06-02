export interface Project {
  title: string
  slug: string
  description: string
  technologies: string[]
  github?: string
  paper?: string
  demo?: string
  period?: string
  year: number
  highlights?: string[]
  accuracy?: string
  category: Array<"swe" | "ml">
  longDescription?: string[]
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export const projects: Project[] = [
  {
    title: "TAOL — Trust-Aware Orchestration Layer",
    slug: "taol",
    description:
      "Trust-aware middleware layer for LLM-powered coding agents that quantifies generation reliability using composite risk scoring and automated human-in-the-loop decision routing.",
    technologies: ["Python", "FastAPI", "Ollama", "AST", "Scikit-learn", "AI/ML"],
    demo: "https://taol-demo.vercel.app/",
    period: "May 2026",
    year: 2026,
    category: ["ml", "swe"],
    accuracy: "99.2% ambiguity detection",
    longDescription: [
      "Architected a trust-aware middleware layer for LLM-powered coding agents that quantified generation reliability using composite risk scoring and automated human-in-the-loop decision routing.",
      "Engineered an end-to-end AI governance pipeline integrating FastAPI, Ollama, AST indexing, semantic retrieval, and machine learning classifiers to detect ambiguous or high-risk code-generation requests with 99.2% accuracy.",
      "Benchmarked and optimized LLM-generated code quality on 500 SWE-bench Verified tasks by conducting large-scale ablation studies, signal calibration, and data-driven threshold optimization.",
    ],
  },
  {
    title: "Brandeis — Privacy Technology Advisor",
    slug: "brandeis",
    description:
      "Privacy technology advisor that analyzes 11 user-defined constraints to recommend among 10 privacy-enhancing technologies, providing explainable decision paths and implementation recommendations.",
    technologies: ["React 19", "TypeScript", "Rule Engine", "Privacy Engineering"],
    demo: "https://brandeis-two.vercel.app/",
    period: "April 2026",
    year: 2026,
    category: ["swe"],
    longDescription: [
      "Designed and implemented a privacy technology advisor that analyzes 11 user-defined constraints to recommend among 10 privacy-enhancing technologies, providing explainable decision paths and implementation recommendations.",
      "Architected a modular recommendation engine with rule evaluation, stack detection, and alternative analysis components, enabling transparent and auditable technology selection without ML or external APIs.",
      "Developed a responsive React 19 application with real-time decision visualization, contextual user guidance, and dynamic recommendation generation, delivering a fully browser-based privacy engineering decision-support tool.",
    ],
  },
  {
    title: "FuelForm (Snapdragon Hack)",
    slug: "fuelform-snapdragon-hack-",
    description:
      "Adaptive fitness and nutrition planner built on Snapdragon S25 Elite with an Android app, on-device model, and laptop AI agents synced via Firebase.",
    technologies: ["Android", "Kotlin", "Firebase", "Python", "AI/ML", "Snapdragon S25 Elite"],
    github: "https://github.com/KartikDaGreat/FuelForm",
    period: "February 2026",
    year: 2026,
    category: ["ml", "swe"],
  },
  {
    title: "Mind Duelist — AI Adversarial Interviewer",
    slug: "mind-duelist-ai-adversarial-interviewer",
    description:
      "Real-time voice-based technical interviewer that detects bluffing, maps knowledge gaps, and dynamically escalates follow-up questions using LLM-driven gap analysis and live scoring.",
    technologies: ["React", "TypeScript", "ElevenLabs", "Gemini Flash", "Supabase", "Edge Functions", "AI/ML"],
    github: "https://github.com/KartikDaGreat/NightmareBot",
    period: "February 2026",
    year: 2026,
    category: ["ml", "swe"],
  },
  {
    title: "On-Device Document Classification",
    slug: "on-device-document-classification",
    description: "Framework to classify documents based on images and limited text for on-device deployment.",
    technologies: ["Python", "CNN", "TensorFlow"],
    period: "January - May 2024",
    year: 2024,
    paper: "https://ieeexplore.ieee.org/abstract/document/10696508",
    category: ["ml"],
    highlights: ["3.7M parameter model", "Published at ISEC-2025"],
  },
  {
    title: "Psychological Counselling Chatbot",
    slug: "psychological-counselling-chatbot",
    description: "3-modal chatbot for assessing patients' mental states.",
    technologies: ["Python", "Flask", "AngularJS"],
    period: "January - March 2024",
    year: 2024,
    paper: "https://dl.acm.org/doi/10.1145/3717383.3717387",
    category: ["ml"],
    accuracy: "87% satisfaction",
  },
  {
    title: "Skin Cancer Detection Ensemble",
    slug: "skin-cancer-detection-ensemble",
    description: "Ensemble model using ResNet, EfficientNet, and MobileNet.",
    technologies: ["Python", "PyTorch"],
    period: "October - December 2023",
    year: 2023,
    paper: "#",
    category: ["ml"],
    accuracy: "96.33%",
  },
  {
    title: "Fake News Origin Detection",
    slug: "fake-news-origin-detection",
    description: "ML system for detecting the origins of misinformation.",
    technologies: ["Python", "NLP", "Scikit-learn"],
    period: "March - May 2024",
    year: 2024,
    category: ["ml"],
    accuracy: "96.3%",
  },
  {
    title: "Traffic Speed Detection System",
    slug: "traffic-speed-detection-system",
    description: "Automated Speeding Ticket Framework for NHAI using computer vision.",
    technologies: ["Computer Vision", "IoT", "Python"],
    year: 2023,
    category: ["swe"],
  },
  {
    title: "Chota-Dhobi Mobile App",
    slug: "chota-dhobi-mobile-app",
    description: "On-demand laundry services app with real-time tracking.",
    technologies: ["Firebase", "Mobile Dev"],
    github: "https://github.com/KartikDaGreat",
    year: 2023,
    category: ["swe"],
  },
  {
    title: "Personal Portfolio Website",
    slug: "personal-portfolio-website",
    description: "Interactive portfolio with terminal emulator, file management, and dynamic theming.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/KartikDaGreat/kartikgounder-website",
    year: 2025,
    category: ["swe"],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug)
}
