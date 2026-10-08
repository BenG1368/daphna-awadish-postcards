"use client";

import { useEffect, useState, type ReactNode } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 md:h-24 md:gap-6 md:px-8">
        <Link
          href="/"
          className="font-serif text-[1.375rem] leading-none tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-[1.75rem] md:text-[2rem]"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <HeaderLink key={link.href} href={link.href} current={pathname === link.href}>
                {link.label}
              </HeaderLink>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label={`Inquiry, ${count} ${count === 1 ? "design" : "designs"}`}
            onClick={() => setOpen(true)}
          >
            Inquiry
            <span className="inline-flex h-6 min-w-6 items-center justify-center border border-foreground px-1 text-sm leading-none tabular-nums">
              {count}
            </span>
          </button>
          <button
            type="button"
            className="text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav
        id="site-menu"
        aria-label="Sections"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto grid max-w-6xl px-5 py-2">
          {links.map((link) => (
            <HeaderLink
              key={link.href}
              href={link.href}
              current={pathname === link.href}
              className="py-3 text-base"
            >
              {link.label}
            </HeaderLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

function HeaderLink({
  href,
  current,
  className,
  children,
}: {
  href: string;
  current: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "text-[0.9375rem] underline-offset-[6px] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        current ? "underline decoration-foreground" : "decoration-foreground/30 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
