/** @type {import('next').NextConfig} */
const WANTS_MARKDOWN = [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // ImageLightbox requests quality 90; Next 16 warns for any value not listed.
    qualities: [75, 90],
  },
  // Agent-facing markdown lives under /api/agent/md; these give it the
  // conventional URLs (the page URL plus .md) and serve it to any client that
  // asks for text/markdown on a page URL.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/:doc(profile|work|projects|research|education).md", destination: "/api/agent/md/:doc" },
        { source: "/projects/:slug.md", destination: "/api/agent/md/projects/:slug" },
        { source: "/", has: WANTS_MARKDOWN, destination: "/llms.txt" },
        { source: "/projects/:slug", has: WANTS_MARKDOWN, destination: "/api/agent/md/projects/:slug" },
      ],
    }
  },
  async headers() {
    const discovery = [{ key: "Link", value: '</llms.txt>; rel="alternate"; type="text/plain"; title="LLM index"' }]
    return [
      { source: "/", headers: discovery },
      { source: "/projects/:slug", headers: discovery },
    ]
  },
}

export default nextConfig
