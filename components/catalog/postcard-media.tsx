import Image from "next/image";
import { cn } from "@/lib/utils";

export function PostcardMedia({
  src,
  alt,
  sizes,
  priority = false,
  className,
  layout = "fill",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  layout?: "fill" | "natural";
}) {
  if (!src) {
    return (
      <div className="grid h-full place-items-center px-4 text-center text-sm text-muted">
        Image coming
      </div>
    );
  }

  if (layout === "natural") {
    return (
      // The file's own shape sets the card height, so landscape drawings stay large.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("block h-auto w-full", className)} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      className={cn(
        "postcard-media object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]",
        className,
      )}
    />
  );
}
