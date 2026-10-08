import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { InquiryProvider } from "@/components/inquiry/inquiry-provider";
import { InquiryDrawer } from "@/components/layout/inquiry-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <InquiryProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <InquiryDrawer />
          <Toaster position="bottom-center" />
        </InquiryProvider>
      </body>
    </html>
  );
}
