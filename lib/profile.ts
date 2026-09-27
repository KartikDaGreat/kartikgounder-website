import type { Impact } from "@/components/impact-strip"

/**
 * The single source of truth for everything about Kartik that is not a
 * project (those live in lib/projects.ts). The UI sections render it, and the
 * agent-facing endpoints (/llms.txt, /llms-full.txt, *.md, /api/agent) are
 * generated from it, so the two can never drift apart.
 */

// ---- Basics ----

export const SITE_URL = "https://kartikgounder.com"

export const basics = {
  name: "Kartik Gounder",
  headline: "Software engineer building AI agent infrastructure and ML systems that survive contact with production",
  summary:
    "MS in Computer Science at Columbia, graduating December 2026. Forward deployed engineer intern at Rapidflare, research assistant with Prof. Tian Zheng, and TA for Policy for Privacy Technologies. Seven internships (Rapidflare, Vertex, Columbia aiX, SAP Labs, Samsung R&D, eNova twice), three peer-reviewed papers (ACM, Springer, IEEE), and two filed patent applications.",
  location: "New York, NY",
  availability:
    "Graduating December 2026 and open to full-time roles in agentic systems, developer tooling, and evaluation.",
  email: "hello@kartikgounder.com",
  personalEmail: "kartikgounder@gmail.com",
  github: "https://github.com/KartikDaGreat",
  linkedin: "https://www.linkedin.com/in/kartik-gounder",
  resume: "https://drive.google.com/file/d/1RDCJcs4V8BLVaDjqGEFXjoqk6KzF-AXi/view?usp=sharing",
}

// ---- Home ----

// The receipts, ordered by how much value each one actually produced.
// Every number already lives elsewhere on this site.
export const proof = [
  {
    value: "2-2.5h",
    label: "cut off every bug traced at Vertex",
    where: "Vertex · Sherlock",
    detail: "An AI tracer that checks a reported bug against Datadog logs and Pulsar events before anyone opens an editor.",
  },
  {
    value: "13%",
    label: "revenue lift I drove across 15 clients",
    where: "eNova · AI modules",
    detail: "Scaled three prediction modules across the Python products, tuned against 15 real client deployments.",
  },
  {
    value: "14/14",
    label: "boxr drawings problem-free, vs 4/14",
    where: "boxr · paired eval",
    detail: "Same model, 14 paired briefs. The plain prompt drew problem-free diagrams 4 times; boxr's guardrails got all 14.",
  },
  {
    value: "3 + 2",
    label: "papers published, patents filed",
    where: "ACM · Springer · IEEE",
    detail: "Three peer-reviewed papers, plus two patents out of $135 of wearable hardware I built and ran.",
  },
]

// The three hats this semester, in the order a visitor most likely cares about.
export const now = [
  {
    kind: "Industry",
    org: "Rapidflare",
    role: "Forward Deployed Engineer Intern",
    detail: "Working directly with customers to get the product running on their real problems.",
  },
  {
    kind: "Research",
    org: "Columbia, with Prof. Tian Zheng",
    role: "Research Assistant",
    detail: "Distilling papers into a form an AI agent can build from, and a reader can chat with to understand.",
  },
  {
    kind: "Teaching",
    org: "Columbia",
    role: "TA, Policy for Privacy Technologies",
    detail: "Helping run the course I took last spring: privacy-enhancing tech, regulation, and where they meet.",
  },
]

// Newest first. Short, and only things that actually happened.
export const recently = [
  {
    when: "Sep 2026",
    title: "Sponsored the AI² workshop at graVITas'26",
    body: [
      "\"AI²: Building AI Systems with AI\" ran September 18 to 20 at VIT, where I wrote my first research papers, landed my first internships, and figured out I love building things with AI. Supporting it felt like a small way to give back to the place that gave me my start.",
      "AI is changing how software gets built, fast, and students shouldn't have to wait for their first job to learn to work with it. Using the tools isn't enough. You have to design, test, and build real systems with them, and that only comes from getting your hands dirty.",
      "Thanks to the graVITas team for putting it together, and to Dr. Shashank Mouli Satapathy for making it happen.",
    ],
  },
]

// ---- Experience ----

export interface Highlight {
  lead: string
  text: string
}

export interface Experience {
  title: string
  company: string
  period: string
  year: number
  location: string
  impact?: Impact[]
  highlights: Highlight[]
  type: "internship" | "research" | "teaching"
  certificate?: string
  /** Pinned above the timeline in the "Right now" group. */
  current?: boolean
}

export const TYPE_LABEL: Record<Experience["type"], string> = {
  internship: "Industry",
  research: "Research",
  teaching: "Teaching",
}

export const experiences: Experience[] = [
  {
    title: "Forward Deployed Engineer Intern",
    company: "Rapidflare",
    period: "September 2026 - Present",
    year: 2026,
    location: "New York, NY",
    type: "internship",
    current: true,
    highlights: [
      {
        lead: "Customer-facing",
        text: "working directly with customers to get the product running on their real problems.",
      },
    ],
  },
  {
    title: "Teaching Assistant, Policy for Privacy Technologies",
    company: "Columbia University",
    period: "Fall 2026",
    year: 2026,
    location: "New York, NY",
    type: "teaching",
    current: true,
    highlights: [
      {
        lead: "Course support",
        text: "for the class I took in Spring 2026, covering privacy-enhancing technologies, regulatory frameworks, and applied privacy engineering.",
      },
    ],
  },
  {
    title: "Research Assistant",
    company: "Columbia University",
    period: "September 2026 - Present",
    year: 2026,
    location: "New York, NY",
    type: "research",
    current: true,
    highlights: [
      {
        lead: "Paper distillation",
        text: "with Prof. Tian Zheng, turning research papers into a form an AI agent can build a project from, and a reader can chat with to understand the paper.",
      },
    ],
  },
  {
    title: "Software Development Intern",
    company: "Vertex Inc.",
    period: "June 2026 - August 2026",
    year: 2026,
    location: "Pennsylvania, US",
    type: "internship",
    impact: [
      { icon: "bug-trace", value: "2-2.5h", label: "saved per bug" },
      { icon: "token-funnel", value: "36.11%", label: "fewer tokens" },
    ],
    highlights: [
      {
        lead: "MCP platform",
        text: "connects 105 enterprise tools through one Electron app, routing real requests across Jira, Slack, GitHub, Confluence, and more.",
      },
      {
        lead: "Sherlock",
        text: "AI bug tracer that validates issues against Datadog logs and Pulsar events with chain-of-thought reasoning. Cuts 2 to 2.5 hours off every debugging cycle.",
      },
      {
        lead: "78 tests",
        text: "across unit, integration, functional, and e2e layers, at 92.65% coverage.",
      },
      {
        lead: "Token instrumentation",
        text: "measured every tool-discovery call, then cut redundant context for a 36.11% saving.",
      },
    ],
  },
  {
    title: "aiX Convergence Design Studio Intern",
    company: "Columbia University",
    period: "Jan 2026 - May 2026",
    year: 2026,
    location: "New York, NY",
    type: "internship",
    impact: [
      { icon: "blur-shield", value: "Blur-first", label: "PII never reaches storage" },
      { icon: "gauge", value: "Eval metrics", label: "for data-science agents" },
    ],
    highlights: [
      {
        lead: "Privacy pipeline",
        text: "image labeling platform with ensemble face detection (MTCNN + RetinaFace + MediaPipe) that blurs PII before anything hits storage.",
      },
      {
        lead: "Agent evaluation",
        text: "metrics with Prof. Tian Zheng for whether a data-science agent actually helps students learn, not just whether it answers correctly.",
      },
      {
        lead: "AI literacy",
        text: "multi-year initiative with Prof. Anthony Vanky, building tools for students and educators working with AI in course design.",
      },
    ],
    certificate: "https://drive.google.com/file/d/1XNSc5r4Z2FpBkPpxfL4F7uuOdVi5_0Mb/view?usp=sharing",
  },
  {
    title: "Software Development Intern",
    company: "eNova Software and Hardware Solutions",
    period: "January 2025 - June 2025",
    year: 2025,
    location: "Coimbatore, Tamil Nadu, India",
    type: "internship",
    impact: [
      { icon: "pipeline-clock", value: "45→35 min", label: "production release" },
      { icon: "revenue-curve", value: "13%", label: "revenue, 15 clients" },
      { icon: "threat-shield", value: "19%", label: "fewer threats shipped" },
    ],
    highlights: [
      {
        lead: "CI/CD",
        text: "parallelized the testing and security checks, taking a production release from about 45 minutes down to 35.",
      },
      {
        lead: "3 AI modules",
        text: "scaled up across the Python products, working with 15 clients to predictively improve revenue by 13%.",
      },
      {
        lead: "Security scanner",
        text: "redesigned around local server-based agentic monitoring, cutting threats that reached a release by 19%.",
      },
    ],
    certificate: "https://drive.google.com/file/d/1kL7yFm7ALNFfT2R6YdrNCYVFRnZWNI_z/view?usp=sharing",
  },
  {
    title: "iXp Intern",
    company: "SAP Labs India",
    period: "June 2024 - August 2024",
    year: 2024,
    location: "Bangalore, India",
    type: "internship",
    impact: [
      { icon: "api-speed", value: "28%", label: "faster API calls" },
      { icon: "auth-key", value: "JWT", label: "on every endpoint" },
    ],
    highlights: [
      { lead: "Farmbot", text: "designed and built the platform, cutting API call time 28% by restructuring frontend request batching." },
      { lead: "XSUAA auth", text: "JWT access tokens locking down every endpoint in the service layer." },
    ],
    certificate: "https://drive.google.com/file/d/1P6tKBze3g_Ph-Tz2fRZoHEUmEasikRZn/view?usp=sharing",
  },
  {
    title: "R&D Intern (Samsung PRISM)",
    company: "Samsung R&D Institute India - Bangalore",
    period: "January 2024 - May 2024",
    year: 2024,
    location: "Bangalore, India",
    type: "internship",
    impact: [
      { icon: "on-device-chip", value: "On-device", label: "classification, no server" },
      { icon: "paper-stack", value: "ISEC-2025", label: "paper published" },
    ],
    highlights: [
      { lead: "On-device CNN", text: "custom framework for document classification that runs on the phone, not a server." },
      { lead: "ISEC-2025", text: "co-authored and published the research paper behind it." },
    ],
    certificate: "https://drive.google.com/file/d/1xpLRjU5B9Chpf3GpxL4jeNGbhm4g0_5B/view?usp=sharing",
  },
  {
    title: "Software Engineer Intern",
    company: "eNova Software and Hardware Solutions",
    period: "August 2023 - December 2023",
    year: 2023,
    location: "Coimbatore, Tamil Nadu, India",
    type: "internship",
    impact: [
      { icon: "server-pulse", value: "Uptime pages", label: "server status monitoring" },
      { icon: "syllabus", value: "Syllabus", label: "intern curriculum rewritten" },
    ],
    highlights: [
      { lead: "Web assets", text: "email landing pages and server status monitoring." },
      { lead: "Training syllabus", text: "updated and enhanced the internship curriculum." },
    ],
    certificate: "https://drive.google.com/file/d/1kL7yFm7ALNFfT2R6YdrNCYVFRnZWNI_z/view?usp=sharing",
  },
]

// ---- Education ----

export type Degree = {
  title: string
  school: string
  period: string
  gpa?: string
  gpaNote?: string
  rank?: { value: string; label: string }
  focus?: string
  current?: boolean
  coursework?: { label: string; items: string[] }[]
}

export type SchoolItem = {
  title: string
  school: string
  period: string
}

export type LeadershipItem = {
  title: string
  org: string
  period: string
  highlight: string
}

export type AccoladeItem = {
  title: string
  org: string
  period: string
  detail?: string
}

export const degrees: Degree[] = [
  {
    title: "Master of Science, Computer Science",
    school: "Columbia Engineering",
    period: "Aug 2025 – Dec 2026",
    gpa: "3.62",
    gpaNote: "3.76 cumulative expected at graduation",
    focus: "AI, Machine Learning, Healthcare Applications",
    current: true,
    coursework: [
      {
        label: "Fall 2026",
        items: ["Advanced Software Engineering", "Projects in Computer Science"],
      },
      {
        label: "Spring 2026 · 4.1 GPA",
        items: [
          "User Interface Design",
          "Ethical and Responsible AI",
          "Topics in Software Engineering",
          "Policy for Privacy Technologies",
        ],
      },
      {
        label: "Fall 2025 · 3.1 GPA",
        items: ["Machine Learning", "Databases", "Algorithms", "Computational Learning Theory"],
      },
    ],
  },
  {
    title: "Bachelor of Technology, Computer Science",
    school: "Vellore Institute of Technology",
    period: "May 2021 – May 2025",
    gpa: "9.6/10",
    rank: { value: "11", label: "of 4,000" },
  },
]

export const earlierSchooling: SchoolItem[] = [
  { title: "High School, Computer Science", school: "Suguna PIP School", period: "Aug 2019 – Apr 2021" },
  { title: "Middle School", school: "SSVM Institutions", period: "Aug 2017 – May 2019" },
]

export const leadership: LeadershipItem[] = [
  {
    title: "Member Secretary, Student Council",
    org: "VIT",
    period: "Sep 2023 – Aug 2024",
    highlight: "Represented 12,000+ students in Academic Council meetings and ran 15+ concurrent events during Yantra.",
  },
  {
    title: "Technical Board Member",
    org: "IEEE Computer Society",
    period: "Aug 2023 – May 2024",
    highlight: "Mentored project teams across AI, IoT, web, and ML tracks; built a speed-detection system for NHAI.",
  },
  {
    title: "Guest Speaker",
    org: "KV Institute of Management",
    period: "Jun 2019 – May 2020",
    highlight: "12 sessions on emerging tech, with AI/ML workshops designed for business cohorts.",
  },
]

export type Certification = {
  title: string
  issuer: string
  issued: string
  expires: string
  validation: string
  verifyUrl: string
  file: string
}

export const certifications: Certification[] = [
  {
    title: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    issued: "Sep 2026",
    expires: "Sep 2029",
    validation: "975f13fc321e47fd95320f533689a31c",
    verifyUrl: "https://aws.amazon.com/verification",
    file: "/certificates/aws-certified-ai-practitioner.pdf",
  },
]

export const accolades: AccoladeItem[] = [
  {
    title: "Semi-finalist, Innovation Challenge",
    org: "Accenture",
    period: "2023",
    detail: "Selected from 50,000+ teams",
  },
  { title: "Winners, Game Of Codes", org: "IEEE-CS", period: "2023", detail: "1st place among 30+ teams" },
  { title: "Third Place, Cryptic Hunt", org: "ACM-VIT", period: "2022" },
  {
    title: "Blood Donation Camp Organizer",
    org: "VIT",
    period: "2022 – 2024",
    detail: "Planned recurring campus drives",
  },
  {
    title: "Operation HOPE Volunteer",
    org: "Operation HOPE",
    period: "2019 – 2024",
    detail: "Financial literacy outreach",
  },
]

// ---- Research ----

export interface Publication {
  title: string
  venue: string
  year: string
  authors: string
  link?: string
  type: "paper" | "patent"
  description?: string
  image?: string
}

export const publications: Publication[] = [
  {
    title: "A Lightweight Hybrid CNN-Fuzzy Logic Approach for Real Time On-Device Document Classification",
    venue: "ISEC 2025 (ACM)",
    year: "2025",
    authors: "K. Gounder et al.",
    link: "https://doi.org/10.1145/3717383.3717387",
    type: "paper",
    image: "/DeviceClassificationFramework.PNG",
    description:
      "A 3.7M-parameter CNN that classifies documents on the phone itself. No cloud, and it still works when the OCR is garbage.",
  },
  {
    title: "A Hybrid-Multimodal Mental Health Chatbot for Psychological Counselling",
    venue: "BITMDM-2024 (Springer)",
    year: "2024",
    authors: "K. Gounder et al.",
    link: "https://doi.org/10.1007/978-3-031-82706-8_23",
    type: "paper",
    image: "/PsychologicalCounsellingFramework.PNG",
    description:
      "Reads what patients type, how their voice sounds, and what their face shows. It catches the trembling voice behind 'I'm fine'. 87% patient satisfaction.",
  },
  {
    title: "Ensemble Model using Various CNNs for Improved Skin Cancer Diagnosis",
    venue: "ICoICI-2024 (IEEE)",
    year: "2024",
    authors: "K. Gounder et al.",
    link: "https://doi.org/10.1109/ICoICI62503.2024.10696508",
    type: "paper",
    image: "/SkinCancerFramework.PNG",
    description:
      "Three CNNs voting together hit 96.33% on skin lesion classification, beating every individual model in the ensemble.",
  },
]

export const patents: Publication[] = [
  {
    title: "Sensor-Fused Object Distance Estimation And Visual Scaling For Wearable Electronic System",
    venue: "Patent Application",
    year: "2024",
    authors: "K. Gounder",
    type: "patent",
    image: "/SmartGlassPicture.png",
    description: "Smart glasses that fuse ultrasonic and infrared sensors to estimate distance, then visually scale what the wearer sees.",
  },
  {
    title: "Multimodal Context-Adaptive Keyframe Selection System for Vision Assistive Wearables",
    venue: "Patent Application",
    year: "2024",
    authors: "K. Gounder",
    type: "patent",
    image: "/KeyframeSelectionFramework.png",
    description: "Picks which video frames deserve compute on vision-assistive wearables, using scene complexity, motion, and gaze.",
  },
]

// ---- Skills ----

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages & Frameworks", items: ["TypeScript", "Python", "Java", "C++", "React", "Next.js", "Flask", "Kotlin"] },
  { label: "ML/AI & Data", items: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "LLMs", "MCP", "Ollama", "PostgreSQL"] },
  { label: "Infrastructure & Tools", items: ["AWS", "Docker", "Electron", "CI/CD", "Vercel", "Firebase", "Git", "Jest"] },
]
