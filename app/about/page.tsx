import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About",
  description: "About illustrator Daphna Awadish.",
};

export default function Page() {
  return <AboutPage />;
}
