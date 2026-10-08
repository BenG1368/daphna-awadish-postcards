"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostcardMedia } from "@/components/catalog/postcard-media";
import { useInquiry } from "@/components/inquiry/inquiry-provider";
import { WholesaleInquiryForm } from "@/components/inquiry/wholesale-inquiry-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

export function InquiryDrawer() {
  const { items, open, setOpen, remove, setQuantity } = useInquiry();
  const router = useRouter();
  const countLabel = `${items.length} ${items.length === 1 ? "design" : "designs"}`;

  function browseCatalog() {
    setOpen(false);
    router.push("/catalog");
    window.setTimeout(() => {
      document.getElementById("catalog-search")?.focus();
    }, 350);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent aria-describedby={undefined}>
        <div className="border-b border-border px-5 py-5 pr-14">
          <SheetTitle className="font-serif text-2xl">Inquiry</SheetTitle>
          <SheetDescription className="mt-1 text-sm text-muted">
            {countLabel}
          </SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div>
              <p className="text-sm leading-relaxed">
                No designs yet. Add postcards from the catalog, then send one
                wholesale inquiry.
              </p>
              <button
                type="button"
                className="mt-4 text-sm underline underline-offset-4"
                onClick={browseCatalog}
              >
                Browse the catalog
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
              <ul className="grid gap-4">
                {items.map((item) => (
                  <li key={item.id} className="grid grid-cols-[4.5rem_1fr] gap-3">
                    <div className="relative aspect-[3/4] bg-background">
                      <PostcardMedia
                        src={item.blobUrl}
                        alt=""
                        sizes="72px"
                        className="group-hover:scale-100"
                      />
                    </div>
                    <div>
                      <p className="font-serif leading-snug">{item.title}</p>
                      <p className="mt-1 text-xs tracking-[0.14em] text-muted uppercase">
                        {item.category}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          className="grid size-8 place-items-center border border-border"
                          aria-label={`Decrease ${item.title}`}
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="grid size-8 place-items-center border border-border"
                          aria-label={`Increase ${item.title}`}
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                          onClick={() => remove(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <WholesaleInquiryForm />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
