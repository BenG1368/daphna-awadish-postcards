"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInquiry } from "@/components/inquiry/inquiry-provider";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/custom", label: "Custom" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { items, setOpen } = useInquiry();
  const count = items.length;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight"
        >
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 md:gap-6" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm",
                pathname === link.href ? "text-foreground" : "text-muted",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm"
            aria-label={`Inquiry, ${count} ${count === 1 ? "design" : "designs"}`}
            onClick={() => setOpen(true)}
          >
            Inquiry
            <span className="inline-flex min-w-5 justify-center border border-foreground px-1 text-xs leading-5 tabular-nums">
              {count}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
