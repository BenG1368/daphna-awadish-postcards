import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PartnershipGallery } from "@/components/custom/partnership-gallery";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/partnerships";

export function PartnershipPage({
  project,
  nextProject,
}: {
  project: CaseStudy;
  nextProject: CaseStudy;
}) {
  return (
    <article className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
      <Link
        href="/custom#collaborations"
        className="inline-flex items-center gap-2 text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to custom work
      </Link>

      <header className="mt-8 grid gap-8 border-b border-border pb-10 md:mt-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:items-end md:gap-12 md:pb-12">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            {project.category} · {project.location}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {project.story}
          </p>
        </div>

        <dl className="grid gap-4 border-t border-border pt-6 text-sm md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="grid gap-0.5">
            <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">
              Client
            </dt>
            <dd className="text-foreground">{project.name}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">
              Location
            </dt>
            <dd className="text-foreground">{project.location}</dd>
          </div>
          <div className="grid gap-1.5">
            <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">
              Deliverables
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {project.scope.map((item) => (
                <span
                  key={item}
                  className="border border-border bg-card px-2.5 py-0.5 text-xs text-foreground"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <PartnershipGallery project={project} />

      <footer className="mt-16 grid gap-10 border-t border-border pt-12 md:mt-24 md:grid-cols-2 md:items-center md:gap-12">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Start a project
          </p>
          <h2 className="mt-3 font-serif text-2xl md:text-3xl">
            Planning something for your shop?
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Tell me about your business and what you would like to illustrate.
            I will write back with a quote and timeline.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/custom#quote">Request a quote</Link>
            </Button>
          </div>
        </div>

        <Link
          href={`/custom/${nextProject.slug}`}
          className="group flex items-center gap-5 border border-border bg-card p-4 transition-colors duration-300 ease-out hover:border-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <div className="aspect-[4/5] w-24 shrink-0 overflow-hidden bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nextProject.cover.src}
              alt={nextProject.cover.alt}
              width={nextProject.cover.width}
              height={nextProject.cover.height}
              loading="lazy"
              decoding="async"
              style={
                nextProject.cover.objectPosition
                  ? { objectPosition: nextProject.cover.objectPosition }
                  : undefined
              }
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
              Next collaboration
            </p>
            <p className="mt-1.5 font-serif text-xl">{nextProject.name}</p>
            <p className="mt-1 text-xs text-muted">
              {nextProject.category} · {nextProject.location}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground">
              View project
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      </footer>
    </article>
  );
}
