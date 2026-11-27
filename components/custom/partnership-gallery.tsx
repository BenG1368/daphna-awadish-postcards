"use client";

import { useState } from "react";
import { ProjectLightbox } from "@/components/custom/project-lightbox";
import type { CaseStudy, GalleryItem } from "@/lib/partnerships";
import { getCaseStudyImages } from "@/lib/partnerships";

export function PartnershipGallery({ project }: { project: CaseStudy }) {
  const allImages = getCaseStudyImages(project);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function openImage(src: string) {
    const idx = allImages.findIndex((item) => item.src === src);
    if (idx !== -1) setActiveIndex(idx);
  }

  return (
    <>
      <div className="mt-12 grid gap-10 md:mt-16 md:gap-14">
        {project.gallery.map((row, rowIndex) => {
          if (row.layout === "full") {
            const item = row.items[0];
            return (
              <GalleryFigure
                key={item.src}
                item={item}
                mode={item.kind === "artwork" ? "artwork-full" : "photo-full"}
                priority={rowIndex === 0}
                onOpen={() => openImage(item.src)}
              />
            );
          }

          return (
            <div
              key={row.items.map((item) => item.src).join("-")}
              className="grid gap-8 md:grid-cols-2 md:gap-8"
            >
              {row.items.map((item, itemIndex) => (
                <GalleryFigure
                  key={item.src}
                  item={item}
                  mode={
                    row.aspect === "artwork"
                      ? "artwork-pair"
                      : row.aspect === "square"
                        ? "photo-square"
                        : "photo-portrait"
                  }
                  priority={rowIndex === 0 && itemIndex === 0}
                  onOpen={() => openImage(item.src)}
                />
              ))}
            </div>
          );
        })}
      </div>

      <ProjectLightbox
        items={allImages}
        index={activeIndex}
        title={project.name}
        eyebrow={`${project.category} · ${project.location}`}
        onIndexChange={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}

function GalleryFigure({
  item,
  mode,
  priority,
  onOpen,
}: {
  item: GalleryItem;
  mode:
    | "photo-full"
    | "photo-portrait"
    | "photo-square"
    | "artwork-full"
    | "artwork-pair";
  priority: boolean;
  onOpen: () => void;
}) {
  const isArtwork = mode === "artwork-full" || mode === "artwork-pair";

  return (
    <figure className="flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View larger: ${item.caption}`}
        className="group block w-full cursor-zoom-in overflow-hidden border border-border bg-card text-left transition-colors duration-300 ease-out hover:border-foreground/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {isArtwork ? (
          <div
            className={
              mode === "artwork-full"
                ? "flex items-center justify-center bg-card p-5 sm:p-8 md:p-12"
                : "flex aspect-[4/3] items-center justify-center bg-card p-5 sm:p-6"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={
                mode === "artwork-full"
                  ? "max-h-[68vh] w-auto max-w-full object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.015]"
                  : "h-full w-full object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
              }
            />
          </div>
        ) : (
          <div
            className={
              mode === "photo-full"
                ? "aspect-[16/10] w-full overflow-hidden bg-background"
                : mode === "photo-square"
                  ? "aspect-square w-full overflow-hidden bg-background"
                  : "aspect-[4/5] w-full overflow-hidden bg-background"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              style={
                item.objectPosition
                  ? { objectPosition: item.objectPosition }
                  : undefined
              }
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
            />
          </div>
        )}
      </button>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-muted">
        <span>{item.caption}</span>
        {isArtwork ? (
          <span className="shrink-0 text-[11px] tracking-[0.14em] uppercase">
            Artwork
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
