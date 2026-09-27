import { llmsTxt } from "@/lib/agent"
import { markdown } from "@/lib/agent-http"

export const dynamic = "force-static"

export function GET() {
  return markdown(llmsTxt(), "text/plain")
}
