"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { resolvedMoq } from "@/lib/catalog";
import type { InquiryItem, Postcard } from "@/lib/types";

const STORAGE_KEY = "daphna-wholesale-inquiry";

type InquiryContextValue = {
  items: InquiryItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: (postcard: Postcard) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const openedOnce = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as InquiryItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<InquiryContextValue>(() => {
    function add(postcard: Postcard) {
      const moq = resolvedMoq(postcard);
      setItems((current) => {
        if (current.some((item) => item.id === postcard.id)) return current;
        return [
          ...current,
          {
            id: postcard.id,
            title: postcard.title,
            category: postcard.category,
            imageFilename: postcard.imageFilename,
            blobUrl: postcard.blobUrl,
            quantity: moq,
            moq,
          },
        ];
      });
      toast(`${postcard.title} added to inquiry`);
      if (!openedOnce.current) {
        openedOnce.current = true;
        setOpen(true);
      }
    }

    return {
      items,
      open,
      setOpen,
      has: (id) => items.some((item) => item.id === id),
      toggle: (postcard) => {
        if (items.some((item) => item.id === postcard.id)) {
          setItems((current) => current.filter((item) => item.id !== postcard.id));
          toast(`${postcard.title} removed`);
          return;
        }
        add(postcard);
      },
      remove: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      setQuantity: (id, quantity) => {
        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(999, Math.max(item.moq, quantity)) }
              : item,
          ),
        );
      },
      clear: () => setItems([]),
    };
  }, [items, open]);

  return (
    <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error("useInquiry must be used within InquiryProvider");
  }
  return context;
}
