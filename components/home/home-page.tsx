import Link from "next/link";
import { PostcardCard } from "@/components/catalog/postcard-card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { Postcard } from "@/lib/types";

export function HomePage({ postcards }: { postcards: Postcard[] }) {
  const featured =
    postcards.find((postcard) => postcard.blobUrl) ?? postcards[0];
  const more = postcards
    .filter((postcard) => postcard.id !== featured?.id)
    .slice(0, 4);
  const categories = getCategories(postcards);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-8 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-14 md:px-8 md:py-12">
        <div className="order-2 max-w-xl md:order-1">
          <p className="text-[13px] tracking-[0.18em] text-muted uppercase">
            Wholesale stationery
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
            {site.name}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            {site.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild>
              <Link href="/catalog">Browse the catalog</Link>
            </Button>
            <Button asChild variant="quiet" className="underline">
              <Link href="/custom">Request a custom illustration</Link>
            </Button>
          </div>
        </div>

        {featured?.blobUrl ? (
          <figure className="order-1 md:order-2">
            <Link
              href={`/catalog#${featured.id}`}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.blobUrl}
                alt={featured.title}
                fetchPriority="high"
                decoding="async"
                className="mx-auto h-auto max-h-[62svh] w-auto max-w-full md:max-h-[min(78svh,860px)]"
              />
            </Link>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-serif text-lg leading-snug">{featured.title}</span>
              <span className="shrink-0 text-[13px] tracking-[0.16em] text-muted uppercase">
                {featured.category}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </section>

      {categories.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 py-6 md:px-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/catalog?category=${encodeURIComponent(category)}`}
                className="text-[13px] tracking-[0.14em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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
