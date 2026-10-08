import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/custom/quote-request-form";

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
        <p className="mt-4 max-w-sm leading-relaxed text-muted">
          Tell Daphna about the business, the timing, and what the drawing needs
          to do. She will reply with a quote.
        </p>
      </div>
      <QuoteRequestForm />
    </div>
  );
}
