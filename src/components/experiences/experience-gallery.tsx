"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

export function ExperienceGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return (
      <section aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">Image gallery</h2>
        <div className="grid aspect-[16/8] place-items-center rounded-2xl bg-slate-200 text-slate-500">
          <ImageIcon className="size-9" />
          <span className="sr-only">No images are available</span>
        </div>
      </section>
    );
  }

  const selectRelative = (difference: number) => {
    setSelectedIndex((current) =>
      (current + difference + images.length) % images.length,
    );
  };

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">Image gallery</h2>
      <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-slate-200">
        <Image
          key={selectedImage}
          src={selectedImage}
          alt={`${title}, image ${selectedIndex + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => selectRelative(-1)}
              aria-label="Show previous image"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow-lg hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => selectRelative(1)}
              aria-label="Show next image"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow-lg hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-navy/75 px-3 py-1 text-xs font-semibold text-white">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label="Choose gallery image">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2",
                selectedIndex === index
                  ? "border-teal"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
