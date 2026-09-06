"use client";

import { useState } from "react";

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
      <div className="relative">
        <img
          src={allImages[current]}
          alt={`Foto ${current + 1}`}
          className="w-full aspect-square object-contain rounded-lg bg-gray-100"
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
            <img
              key={index}
              src={url}
              onClick={() => setCurrent(index)}
              className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                index === current ? "border-black" : "border-transparent"
              }`}
              alt={`Miniatura ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}