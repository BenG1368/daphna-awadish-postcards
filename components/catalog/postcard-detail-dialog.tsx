"use client";

import { useState } from "react";
import { PostcardZoom } from "@/components/catalog/postcard-zoom";
import { useInquiry } from "@/components/inquiry/inquiry-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/site";
import { resolvedMoq } from "@/lib/catalog";
import type { Postcard } from "@/lib/types";

export function PostcardDetailDialog({
  postcard,
  onClose,
}: {
  postcard: Postcard | null;
  onClose: () => void;
}) {
  const { has, toggle } = useInquiry();
  const added = postcard ? has(postcard.id) : false;
  const [zoomed, setZoomed] = useState(false);

  return (
    <Dialog
      open={Boolean(postcard)}
      onOpenChange={(open) => {
        if (!open) {
          setZoomed(false);
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-6xl"
        onEscapeKeyDown={(event) => {
          if (!zoomed) return;
          event.preventDefault();
          setZoomed(false);
        }}
        onPointerDownOutside={(event) => {
          if (zoomed) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (zoomed) event.preventDefault();
        }}
      >
        {postcard ? (
          <div className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="flex items-center justify-center bg-background px-4 py-6 md:px-8 md:py-10">
              {postcard.blobUrl ? (
                <button
                  type="button"
                  className="cursor-zoom-in text-center"
                  aria-label={`View ${postcard.title} larger`}
                  onClick={() => setZoomed(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postcard.blobUrl}
                    alt={postcard.title}
                    className="mx-auto h-auto max-h-[78vh] w-auto max-w-full"
                  />
                  <span className="mt-3 block text-xs tracking-wide text-muted">
                    Click to look closer
                  </span>
                </button>
              ) : (
                <div className="grid min-h-64 place-items-center text-sm text-muted">
                  Image coming
                </div>
              )}
            </div>
            {zoomed && postcard.blobUrl ? (
              <PostcardZoom
                src={postcard.blobUrl}
                alt={postcard.title}
                onClose={() => setZoomed(false)}
              />
            ) : null}
            <div className="flex flex-col gap-4 p-6 md:py-8 md:pr-12">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                {postcard.category}
              </p>
              <DialogTitle className="font-serif text-3xl leading-tight">
                {postcard.title}
              </DialogTitle>
              <DialogDescription
                className={
                  postcard.description
                    ? "text-base leading-relaxed text-foreground"
                    : "sr-only"
                }
              >
                {postcard.description || `${postcard.title}, ${postcard.category}`}
              </DialogDescription>
              <p className="text-sm">
                {postcard.suggestedRetail == null
                  ? "Pricing on request"
                  : `Suggested retail ${formatMoney(postcard.suggestedRetail)}`}
              </p>
              <p className="text-sm text-muted">
                Minimum order: {resolvedMoq(postcard)} per design
              </p>
              <Button type="button" onClick={() => toggle(postcard)}>
                {added ? "Added" : "Add to inquiry"}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
