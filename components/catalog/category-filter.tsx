"use client";

import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}) {
  const options = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">
      {options.map((category) => {
        const active = value === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category)}
            className={cn(
              "h-9 border px-3 text-sm transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-transparent text-foreground",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
