import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getPostcards } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse Daphna Awadish postcard collections for wholesale.",
};

export default function CatalogPage() {
  const postcards = getPostcards();
  return (
    <Suspense>
      <CatalogBrowser postcards={postcards} />
    </Suspense>
  );
}
