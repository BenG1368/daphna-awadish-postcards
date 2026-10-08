import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Toaster } from "sonner";
import { InquiryProvider } from "@/components/inquiry/inquiry-provider";
import { InquiryDrawer } from "@/components/layout/inquiry-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-source-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
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
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
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
