"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RobustImage from "~/components/ui/robust-image";

export default function ImageBanner({ imageURLs }: { imageURLs: string[] }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (imageURLs.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % imageURLs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageURLs.length]);

  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {imageURLs.length > 0 &&
        imageURLs.map((src, index) => (
          <RobustImage
            key={`${src}-${index}`}
            src={src}
            alt={`Village scenery ${index + 1}`}
            fill
            fallbackSrc="/szechenyi_terv.jpg"
            className={`object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex items-end justify-between p-8">
        <Image src="/logo.ico" alt="Logo" width={100} height={100} />
        <h1 className="text-4xl font-bold text-white md:text-6xl">
          Bakonykúti
        </h1>
      </div>
    </div>
  );
}
