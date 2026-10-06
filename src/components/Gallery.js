"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ mainImage, images }) {
  const safeImages = Array.isArray(images) ? images : [];
  const allImages = [mainImage, ...safeImages].filter(Boolean);
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));
  }

  if (allImages.length === 0) return null;

  return (
    <div>
      <div className="relative w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
        <Image
          src={allImages[current]}
          alt={`Foto ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          priority={current === 0}
          className="object-contain"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full hover:bg-black/70"
            >
              ›
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-2 py-0.5 rounded">
              {current + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {allImages.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative w-16 h-16 shrink-0 overflow-hidden rounded cursor-pointer border-2 ${
                index === current ? "border-black" : "border-transparent"
              }`}
            >
              <Image
                src={url}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
