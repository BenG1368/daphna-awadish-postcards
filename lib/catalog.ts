import postcardsJson from "@/public/data/postcards.json";
import { site } from "@/lib/site";
import type { Postcard } from "@/lib/types";

export function getPostcards(): Postcard[] {
  return postcardsJson as Postcard[];
}

export function getCategories(postcards: Postcard[]) {
  return [...new Set(postcards.map((postcard) => postcard.category))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function resolvedMoq(postcard: Pick<Postcard, "moq">) {
  return postcard.moq ?? site.defaultMoq;
}
