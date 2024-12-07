"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const images = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
  "https://images.unsplash.com/photo-1449452198679-05c7fd30f416?q=80&w=2070",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070",
]

export default function ImageBanner() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Village scenery ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
          Bakonykúti
        </h1>
      </div>
    </div>
  )
}