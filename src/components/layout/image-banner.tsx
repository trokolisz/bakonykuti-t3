"use client"

import { useEffect, useState } from "react"
import Image from "next/image"



export default function ImageBanner({ imageURLs }: { imageURLs: string[] }) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % imageURLs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {imageURLs.map((src, index) => (
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
      <div className="absolute inset-0 flex items-end justify-end p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white ">
          Bakonykúti
        </h1>
      </div>
    </div>
  )
}