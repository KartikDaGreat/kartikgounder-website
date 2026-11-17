"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ImageLightboxProps {
  images: string[]
  projectTitle: string
}

const controlClass =
  "pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-150"

/**
 * Radix Dialog supplies the focus trap, Escape, scroll lock and focus return
 * to the thumbnail that opened it.
 */
export function ImageLightbox({ images, projectTitle }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null))
  }, [images.length])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    }
  }

  return (
    <>
      {/* Gallery grid */}
      <div className="columns-2 gap-2 space-y-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Open figure ${i + 1} of ${images.length}`}
            className="block w-full rounded-lg overflow-hidden border border-border bg-card hover:border-primary/50 transition-colors duration-150 cursor-zoom-in break-inside-avoid"
          >
            <Image
              src={src}
              alt={`${projectTitle}, figure ${i + 1}`}
              width={800}
              height={600}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 50vw, 180px"
              quality={90}
              unoptimized
            />
          </button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
          className="inset-0 top-0 left-0 block h-dvh w-screen max-w-none sm:max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0 shadow-none"
        >
          <DialogTitle className="sr-only">{`${projectTitle} gallery`}</DialogTitle>

          {activeIndex !== null && (
            <>
              {/* Clicking the empty area around the image closes, like the old overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4 pt-16 pb-20 md:p-16"
                onClick={(e) => e.target === e.currentTarget && setActiveIndex(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeIndex]}
                  alt={`${projectTitle}, figure ${activeIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                  draggable={false}
                />
              </div>

              <p
                aria-live="polite"
                className="absolute top-4 left-1/2 -translate-x-1/2 flex min-h-11 items-center font-mono text-sm text-white/80"
              >
                {activeIndex + 1} / {images.length}
              </p>

              <DialogClose aria-label="Close gallery" className={`absolute top-4 right-4 ${controlClass}`}>
                <X aria-hidden className="size-5" />
              </DialogClose>

              {images.length > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-4 md:inset-x-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:justify-between">
                  <button type="button" onClick={prev} aria-label="Previous image" className={controlClass}>
                    <ChevronLeft aria-hidden className="size-5" />
                  </button>
                  <button type="button" onClick={next} aria-label="Next image" className={controlClass}>
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
