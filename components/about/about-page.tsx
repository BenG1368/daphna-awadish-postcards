import Link from "next/link";
import { about } from "@/lib/site";

export function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <h1 className="font-serif text-4xl md:text-5xl">Daphna Awadish</h1>
      <p className="mt-3 text-sm tracking-[0.16em] text-muted uppercase">
        {about.role}
      </p>
      <div className="mt-8 grid gap-5 text-base leading-relaxed">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Selected collaborations</h2>
      <ul className="mt-4 grid gap-2">
        {about.collaborations.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p className="mt-12 text-sm">
        <Link href="/catalog" className="underline underline-offset-4">
          Browse the catalog
        </Link>
        <span className="px-2 text-muted">/</span>
        <Link href="/custom" className="underline underline-offset-4">
          Request a custom illustration
        </Link>
      </p>
    </article>
  );
}
