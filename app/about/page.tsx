import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Award-winning animation filmmaker and illustrator based in Amsterdam.",
};

export default function Page() {
  return <AboutPage />;
}
