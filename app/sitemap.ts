import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/profile"
import { getAllProjectSlugs } from "@/lib/projects"

// robots.txt points here. Home holds every section (they are hash routes, so
// they share one URL); each project has its own page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...getAllProjectSlugs().map((slug) => ({ url: `${SITE_URL}/projects/${slug}` })),
  ]
}
