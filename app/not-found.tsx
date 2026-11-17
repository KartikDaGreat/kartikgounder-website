import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-5 py-16 outline-none md:px-10">
      <p className="eyebrow mb-4">404</p>
      <h1 className="t-page">Page not found</h1>
      <p className="t-lede mt-4">This page doesn&rsquo;t exist or has moved. Everything else starts from the home page.</p>
      <div className="mt-8">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </main>
  )
}
