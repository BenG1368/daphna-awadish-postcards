import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { ArrowDown } from "lucide-react";
import { Partnerships } from "@/components/custom/partnerships";
import { QuoteRequestForm } from "@/components/custom/quote-request-form";
import { site } from "@/lib/site";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Custom illustration",
  description:
    "Request a quote for custom packaging, brand mascots, storefront signage, or editorial illustration, and explore recent shop collaborations.",
};

export default function CustomPage() {
  return (
    <div>
      <section
        id="quote"
        className="mx-auto grid max-w-6xl scroll-mt-24 gap-10 px-5 py-14 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-start md:gap-14 md:px-8 md:py-20"
      >
        <div className="md:sticky md:top-28">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            B2B &amp; brand collaborations
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Custom illustration
          </h1>
          <p
            className={`${handwritten.className} mt-5 max-w-md text-[1.85rem] leading-snug text-foreground`}
          >
            Tell me about the business, when you need the illustration, and what
            you hope it will do. I’ll write back with a quote.
          </p>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
            <a
              href="#collaborations"
              className="inline-flex w-fit items-center gap-2 text-foreground underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              See recent shop collaborations
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
            <p className="text-muted">
              Prefer email?{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-foreground underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="border border-border bg-card p-6 md:p-9">
          <QuoteRequestForm />
        </div>
      </section>

      <Partnerships />
    </div>
  );
}
