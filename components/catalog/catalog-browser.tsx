"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryFilter } from "@/components/catalog/category-filter";
import { PostcardCard } from "@/components/catalog/postcard-card";
import { PostcardDetailDialog } from "@/components/catalog/postcard-detail-dialog";
import { getCategories } from "@/lib/catalog";
import type { Postcard } from "@/lib/types";

export function CatalogBrowser({ postcards }: { postcards: Postcard[] }) {
  const categories = useMemo(() => getCategories(postcards), [postcards]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("category");
  const initial =
    requested && categories.includes(requested) ? requested : "All";

  const [category, setCategory] = useState(initial);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort, setSort] = useState<"catalog" | "az" | "za">("catalog");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setCategory(initial);
  }, [initial]);

  useEffect(() => {
    const readHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      setActiveId(postcards.some((postcard) => postcard.id === id) ? id : null);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [postcards]);

  function selectCategory(next: string) {
    setCategory(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") params.delete("category");
    else params.set("category", next);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function openPostcard(id: string) {
    setActiveId(id);
    const search = window.location.search;
    window.history.replaceState(null, "", `${pathname}${search}#${id}`);
  }

  function closePostcard() {
    setActiveId(null);
    window.history.replaceState(null, "", `${pathname}${window.location.search}`);
  }

  const visible = useMemo(() => {
    const needle = debounced.trim().toLowerCase();
    const filtered = postcards.filter((postcard) => {
      if (category !== "All" && postcard.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        postcard.title,
        postcard.category,
        postcard.description,
        ...postcard.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    if (sort === "catalog") return filtered;
    return [...filtered].sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    );
  }, [postcards, category, debounced, sort]);

  const active = postcards.find((postcard) => postcard.id === activeId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">Catalog</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Browse the postcard collections and collect designs for a wholesale
          inquiry.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={selectCategory}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label htmlFor="catalog-search" className="sr-only">
              Search
            </label>
            <input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles"
              className="h-10 w-full border border-border bg-card px-3 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-56"
            />
          </div>
          <label className="text-sm">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as "catalog" | "az" | "za")
              }
              className="h-10 w-full border border-border bg-card px-3 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-44"
            >
              <option value="catalog">Catalog order</option>
              <option value="az">Title A–Z</option>
              <option value="za">Title Z–A</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-16">
          <p>No postcards match.</p>
          <button
            type="button"
            className="mt-3 text-sm underline underline-offset-4"
            onClick={() => {
              setQuery("");
              selectCategory("All");
            }}
          >
            Clear search and category
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {visible.map((postcard) => (
            <PostcardCard
              key={postcard.id}
              postcard={postcard}
              onOpen={openPostcard}
            />
          ))}
        </div>
      )}

      <PostcardDetailDialog postcard={active} onClose={closePostcard} />
    </div>
  );
}
