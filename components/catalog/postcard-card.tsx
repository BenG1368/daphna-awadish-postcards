"use client";

import Link from "next/link";
import { PostcardMedia } from "@/components/catalog/postcard-media";
import { useInquiry } from "@/components/inquiry/inquiry-provider";
import type { Postcard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostcardCard({
  postcard,
  onOpen,
}: {
  postcard: Postcard;
  onOpen?: (id: string) => void;
}) {
  const { has, toggle } = useInquiry();
  const added = has(postcard.id);

  const body = (
    <>
      <div className="bg-background">
        <PostcardMedia
          src={postcard.blobUrl}
          alt={postcard.title}
          sizes="(min-width: 768px) 33vw, 50vw"
          layout="natural"
        />
      </div>
      <div className="px-3 pt-3">
        <h2 className="font-serif text-lg leading-snug">
          {postcard.title}
        </h2>
        <p className="mt-1 text-xs tracking-[0.16em] text-muted uppercase">
          {postcard.category}
        </p>
      </div>
    </>
  );

  return (
    <article
      className={cn(
        "border border-border bg-card transition-colors duration-300 ease-out hover:border-foreground/30",
        postcard.orientation === "landscape" && "col-span-2",
      )}
    >
      {onOpen ? (
        <button
          type="button"
          className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={() => onOpen(postcard.id)}
        >
          {body}
        </button>
      ) : (
        <Link
          href={`/catalog#${postcard.id}`}
          className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {body}
        </Link>
      )}
      <div className="px-3 pt-3 pb-3">
        <button
          type="button"
          className="text-sm underline-offset-4 hover:underline"
          aria-pressed={added}
          onClick={() => toggle(postcard)}
        >
          {added ? "Added" : "Add to inquiry"}
        </button>
      </div>
    </article>
  );
}
