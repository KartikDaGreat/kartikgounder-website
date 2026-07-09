"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"

interface ImageLightboxProps {
  images: string[]
  projectTitle: string
}

export function ImageLightbox({ images, projectTitle }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null))
  }, [images.length])

  useEffect(() => {
    if (activeIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [activeIndex, close, prev, next])

  return (
    <>
      {/* Gallery grid */}
      <div className="columns-2 gap-2 space-y-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="block w-full rounded-lg overflow-hidden border border-border bg-card hover:border-primary/50 transition-colors cursor-zoom-in break-inside-avoid"
          >
            <Image
              src={src}
              alt={`${projectTitle} — figure ${i + 1}`}
              width={800}
              height={600}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 50vw, 220px"
              quality={90}
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          onClick={close}
        >
          {/* Close button — top-left to avoid side panel overlap */}
          <button
            onClick={close}
            className="absolute top-5 left-5 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/80 transition-colors shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 rounded-full bg-white/15 text-white text-sm font-mono">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors text-2xl"
            >
              &#8592;
            </button>
          )}

          {/* Full-screen image area — extra right padding to clear side panel */}
          <div className="absolute inset-0 flex items-center justify-center p-16 pt-20 pr-24 lg:pr-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex]}
              alt={`${projectTitle} — figure ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors text-2xl"
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </>
  )
}
