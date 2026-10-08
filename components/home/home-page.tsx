import Link from "next/link";
import { PostcardCard } from "@/components/catalog/postcard-card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { Postcard } from "@/lib/types";

export function HomePage({ postcards }: { postcards: Postcard[] }) {
  const more = postcards.slice(0, 4);
  const categories = getCategories(postcards);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">
          Wholesale stationery
        </p>
        <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] md:text-7xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
          {site.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/catalog">Browse the catalog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/custom">Request a custom illustration</Link>
          </Button>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3 px-5 py-8 md:px-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/catalog?category=${encodeURIComponent(category)}`}
                className="text-sm tracking-[0.14em] uppercase"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <h2 className="font-serif text-3xl">Selected works</h2>
          <div className="mt-8 grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {more.map((postcard) => (
              <PostcardCard key={postcard.id} postcard={postcard} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-24">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">
              A drawing made for the business
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Branding, packaging, a custom postcard, or an editorial series.
            </p>
          </div>
          <Button asChild>
            <Link href="/custom">Request a custom illustration</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
