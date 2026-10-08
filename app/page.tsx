import { HomePage } from "@/components/home/home-page";
import { getPostcards } from "@/lib/catalog";

export default function Page() {
  return <HomePage postcards={getPostcards()} />;
}
