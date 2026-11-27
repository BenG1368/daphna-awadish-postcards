"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryItem } from "@/lib/partnerships";

export function ProjectLightbox({
  items,
  index,
  title,
  eyebrow,
  onIndexChange,
  onClose,
}: {
  items: readonly GalleryItem[];
  index: number | null;
  title: string;
  eyebrow?: string;
  onIndexChange: (nextIndex: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && index >= 0 && index < items.length;
  const active = open ? items[index] : null;
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!open || !hasMultiple || index === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange((index! - 1 + items.length) % items.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange((index! + 1) % items.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasMultiple, index, items.length, onIndexChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-w-5xl border border-border bg-card p-0">
        {active && index !== null ? (
          <div className="flex flex-col">
            <div className="relative flex min-h-[50vh] items-center justify-center bg-background px-4 py-8 sm:px-14 md:py-10">
              {hasMultiple ? (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    onIndexChange((index - 1 + items.length) % items.length)
                  }
                  className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-border bg-card/90 text-foreground transition-colors hover:border-foreground/40 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <ChevronLeft className="size-4" />
                </button>
              ) : null}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                className="mx-auto max-h-[72vh] w-auto max-w-full object-contain"
              />

              {hasMultiple ? (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => onIndexChange((index + 1) % items.length)}
                  className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center border border-border bg-card/90 text-foreground transition-colors hover:border-foreground/40 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <ChevronRight className="size-4" />
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-1 border-t border-border px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                <DialogTitle className="font-serif text-lg leading-snug">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-sm text-muted">
                  {active.caption}
                </DialogDescription>
              </div>
              {hasMultiple ? (
                <p className="shrink-0 text-xs tabular-nums tracking-[0.12em] text-muted">
                  {index + 1} / {items.length}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
