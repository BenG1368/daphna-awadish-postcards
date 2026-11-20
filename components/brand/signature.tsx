import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Signature({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/daphna-signature.png"
      alt={site.name}
      width={609}
      height={242}
      className={cn("h-auto w-auto", className)}
    />
  );
}
