"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/#experience")}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Experience
    </button>
  )
}
