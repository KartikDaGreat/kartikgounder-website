import { NextResponse } from "next/server"

// JSON Resume spec: https://jsonresume.org/schema/
const resume = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: "Kartik Gounder",
    label: "Software Engineer & ML Researcher",
    email: "hello@kartikgounder.com",
    url: "https://kartikgounder.com",
    summary:
      "MS in Computer Science at Columbia University. Building production-grade systems, AI platforms, and developer tools. Experience spans full-stack development, ML/AI pipelines, and enterprise tooling.",
    location: {
      city: "New York",
      region: "NY",
      countryCode: "US",
    },
    profiles: [
      { network: "GitHub", username: "KartikDaGreat", url: "https://github.com/KartikDaGreat" },
      { network: "LinkedIn", username: "kartik-gounder", url: "https://www.linkedin.com/in/kartik-gounder" },
    ],
  },
  work: [
    {
      name: "Vertex Inc.",
      position: "Software Development Intern",
      location: "Pennsylvania, US",
      startDate: "2026-06",
      highlights: [
        "Built a production-grade MCP platform that connects 105 enterprise tools via an Electron desktop app (10 providers)",
        "Implemented 78 automated tests across unit, integration, functional and e2e layers reaching a 92.65% coverage rate",
        "Integrated data collection for token optimization in tool discovery and reaching 36.11% improved token efficiency",
      ],
    },
    {
      name: "Columbia University",
      position: "aiX Convergence Design Studio Intern",
      location: "New York, NY",
      startDate: "2026-01",
      highlights: [
        "Supporting a multi-year AI literacy initiative in pedagogy with Prof. Anthony Vanky",
        "Using computer vision to examine algorithmic bias and urban equity in course design",
        "Researching and developing statistics for evaluating Data Science related agents with Prof. Tian Zheng",
      ],
    },
    {
      name: "eNova Software and Hardware Solutions",
      position: "Software Development Intern",
      location: "Coimbatore, Tamil Nadu, India",
      startDate: "2025-01",
      endDate: "2025-06",
      highlights: [
        "Built automated deployment scripts with CI/CD pipelines, reducing release time by 23%",
        "Designed data visualization dashboards for internal teams, cutting manual reporting by 8+ hours/week",
      ],
    },
    {
      name: "SAP Labs India",
      position: "iXp Intern",
      location: "Bangalore, India",
      startDate: "2024-06",
      endDate: "2024-08",
      highlights: [
        "Designed and developed Farmbot software, achieving a 28% decrease in API call time",
        "Integrated XSUAA authentication using JWT access tokens",
      ],
    },
    {
      name: "Samsung R&D Institute India - Bangalore",
      position: "R&D Intern (Samsung PRISM)",
      location: "Bangalore, India",
      startDate: "2024-01",
      endDate: "2024-05",
      highlights: [
        "Developed a custom CNN framework for on-device document classification",
        "Co-authored and published a research paper at ISEC-2025",
      ],
    },
    {
      name: "eNova Software and Hardware Solutions",
      position: "Software Engineer Intern",
      location: "Coimbatore, Tamil Nadu, India",
      startDate: "2023-08",
      endDate: "2023-12",
      highlights: [
        "Developed key web assets including email landing pages and server status monitoring",
        "Contributed to the update and enhancement of the internship training syllabus",
      ],
    },
  ],
  education: [
    {
      institution: "Columbia University",
      area: "Computer Science",
      studyType: "Master of Science",
      startDate: "2025-09",
    },
  ],
  skills: [
    { name: "Languages", keywords: ["TypeScript", "Python", "Java", "C++", "Kotlin"] },
    { name: "Frontend", keywords: ["React", "Next.js", "Tailwind CSS", "Electron"] },
    { name: "ML/AI", keywords: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "LLMs", "MCP"] },
    { name: "Infrastructure", keywords: ["AWS", "Docker", "CI/CD", "Vercel", "Firebase", "PostgreSQL"] },
    { name: "Testing", keywords: ["Jest", "Unit Testing", "Integration Testing", "E2E Testing"] },
  ],
  projects: [
    {
      name: "TAOL: Trust-Aware Orchestration Layer",
      description: "Trust-aware middleware for LLM coding agents with 99.2% ambiguity detection",
      keywords: ["Python", "FastAPI", "Ollama", "AST", "Scikit-learn"],
      url: "https://taol-demo.vercel.app/",
    },
    {
      name: "Brandeis: Privacy Technology Advisor",
      description: "Analyzes 11 constraints to recommend among 10 privacy-enhancing technologies",
      keywords: ["React 19", "TypeScript", "Rule Engine"],
      url: "https://brandeis-two.vercel.app/",
    },
    {
      name: "Mind Duelist: AI Adversarial Interviewer",
      description: "Real-time voice-based technical interviewer with bluff detection",
      keywords: ["React", "TypeScript", "ElevenLabs", "Gemini Flash", "Supabase"],
      url: "https://github.com/KartikDaGreat/NightmareBot",
    },
  ],
  publications: [
    { name: "On-Device Document Classification Framework", publisher: "ISEC-2025 (IEEE)" },
    { name: "Psychological Counselling Chatbot", publisher: "BITMDM-2024 (ACM)" },
    { name: "Healthcare Technology Research", publisher: "ICoICI-2024" },
  ],
  meta: {
    version: "v1.0.0",
    lastModified: new Date().toISOString().split("T")[0],
    canonical: "https://kartikgounder.com/api/resume",
  },
}

export async function GET() {
  return NextResponse.json(resume, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
