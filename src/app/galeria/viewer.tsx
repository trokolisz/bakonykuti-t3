"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { formatDate } from "~/lib/utils"
import { type Image as imageType} from "~/server/db/schema"
import Image from "next/image"

function getVisibleIndices(current: number, total: number) {
  if (total <= 7) return Array.from(Array(total).keys())
  const result: number[] = []
  for (let offset = -3; offset <= 3; offset++) {
    const i = (current + offset + total) % total
    result.push(i)
  }
  return result
}

export default function GalleryPageClient({ images }: { images: imageType[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const handleClick = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  const nextImage = useCallback(
    () => setIndex((prev) => (prev + 1) % images.length),
    [images.length]
  )
  const prevImage = useCallback(
    () => setIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  )

  const closeViewer = useCallback(() => setOpen(false), [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !e.changedTouches[0]) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 40) prevImage()    // swipe right
    if (delta < -40) nextImage()   // swipe left
    touchStartX.current = null
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "Escape") closeViewer()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, prevImage, nextImage, closeViewer])

  useEffect(() => {
    if (thumbnailRef.current) {
      const selectedThumb = thumbnailRef.current.children[index] as HTMLElement
      if (selectedThumb) {
        const half = thumbnailRef.current.clientWidth / 2
        const center = selectedThumb.offsetLeft + selectedThumb.clientWidth / 2
        thumbnailRef.current.scrollTo({ left: center - half, behavior: "smooth" })
      }
    }
  }, [index])

  const visibleIndices = getVisibleIndices(index, images.length)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images         
          .map((img, i) => (
            <div
              key={img.id}
              className="overflow-hidden bg-secondary p-2 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleClick(i)}
            >
              {/* ...existing card-like structure... */}
              <div className="relative aspect-square">
                <Image
                  src={img.url}
                  alt={img.title ?? "Uploaded image"}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={img.url.startsWith('/uploads/') || img.url.startsWith('/api/images/')}
                />
              </div>
              {/* ...existing content like Title, Added date... */}
              <h3>{img.title}</h3>
              <p>Added on {formatDate(img.createdAt)}</p>
            </div>
          ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={closeViewer} className="absolute top-4 right-4">
            X
          </button>
          <div className="relative w-full h-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl flex items-center justify-center">
            <div className="relative w-full h-full flex items-center">
              <button
                onClick={prevImage}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <Image
                src={images[index]?.url ?? ""}
                alt={images[index]?.title ?? "Uploaded image"}
                fill
                className="object-contain transition-transform scale-125 lg:scale-150"
                sizes="100vw"
                priority
                unoptimized={(images[index]?.url ?? "").startsWith('/uploads/') || (images[index]?.url ?? "").startsWith('/api/images/')}
              />
              <button
                onClick={nextImage}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          {/* Optional thumbnail preview */}
          <div ref={thumbnailRef} className="flex gap-2 mt-4 overflow-x-auto p-2">
            {visibleIndices.map((i) => (
              <div
                key={images[i]?.id}
                className={`relative w-24 h-16 cursor-pointer ${i === index ? "border-4 border-white" : "border"}`}
                onClick={() => setIndex(i)}
              >
                <Image
                  src={images[i]?.url ?? ""}
                  alt={images[i]?.title ?? "Thumbnail"}
                  fill
                  className="object-cover border"
                  sizes="96px"
                  unoptimized={(images[i]?.url ?? "").startsWith('/uploads/') || (images[i]?.url ?? "").startsWith('/api/images/')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
