import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { QuoteRequestForm } from "@/components/custom/quote-request-form";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Custom illustration",
  description:
    "Request a quote for branding, packaging, a custom postcard, or editorial illustration.",
};

export default function CustomPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-24">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl">Custom illustration</h1>
        <p
          className={`${handwritten.className} mt-5 max-w-md text-[1.85rem] leading-snug text-foreground`}
        >
          Tell me about the business, when you need the illustration, and what you
          hope it will do. I’ll write back with a quote.
        </p>
      </div>
      <QuoteRequestForm />
    </div>
  );
}
