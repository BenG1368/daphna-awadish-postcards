import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center border border-foreground px-1.5 text-xs leading-5",
        className,
      )}
      {...props}
    />
  );
}
