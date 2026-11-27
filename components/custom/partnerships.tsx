"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Maximize2 } from "lucide-react";
import { ProjectLightbox } from "@/components/custom/project-lightbox";
import {
  capabilities,
  caseStudies,
  getCaseStudyImages,
  processSteps,
  singleCommissions,
  type SingleCommission,
} from "@/lib/partnerships";

export function Partnerships() {
  const [activeCommission, setActiveCommission] =
    useState<SingleCommission | null>(null);

  return (
    <>
      <section
        className="border-t border-border"
        aria-labelledby="capabilities-heading"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted uppercase">
                Capabilities
              </p>
              <h2
                id="capabilities-heading"
                className="mt-2 font-serif text-2xl md:text-3xl"
              >
                What I illustrate for businesses
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Original hand-drawn artwork formatted for your exact printers and
              physical touchpoints.
            </p>
          </div>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item) => (
              <li
                key={item.number}
                className="border-t border-foreground/20 pt-4"
              >
                <span className="text-xs tabular-nums tracking-[0.14em] text-muted">
                  {item.number}
                </span>
                <h3 className="mt-2 font-serif text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="collaborations"
        className="scroll-mt-24 border-t border-border"
        aria-labelledby="partnerships-heading"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted uppercase">
                Selected collaborations
              </p>
              <h2
                id="partnerships-heading"
                className="mt-2 font-serif text-3xl md:text-4xl"
              >
                Work for independent shops
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Open any collaboration to see the full project and original
              illustrations.
            </p>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
            {caseStudies.map((project) => {
              const photoCount = getCaseStudyImages(project).length;
              return (
                <li key={project.slug} className="flex">
                  <Link
                    href={`/custom/${project.slug}`}
                    className="group flex w-full flex-col border border-border bg-card transition-colors duration-300 ease-out hover:border-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-background">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.cover.src}
                        alt={project.cover.alt}
                        width={project.cover.width}
                        height={project.cover.height}
                        loading="lazy"
                        decoding="async"
                        style={
                          project.cover.objectPosition
                            ? { objectPosition: project.cover.objectPosition }
                            : undefined
                        }
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                        {project.category} · {project.location}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl leading-snug">
                        {project.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {project.summary}
                      </p>
                      <p className="mt-4 text-xs text-muted">
                        {project.scope.join(" · ")}
                      </p>
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between border-t border-border/80 pt-4 text-sm">
                          <span className="text-xs text-muted">
                            {photoCount} images
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-foreground">
                            View project
                            <ArrowRight
                              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 border-t border-border/80 pt-12">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">
                More shop commissions
              </p>
              <p className="text-xs text-muted">
                Click a commission to inspect it larger
              </p>
            </div>

            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:gap-8">
              {singleCommissions.map((commission) => (
                <li key={commission.id} className="flex">
                  <button
                    type="button"
                    onClick={() => setActiveCommission(commission)}
                    className="group grid w-full cursor-zoom-in overflow-hidden border border-border bg-card text-left transition-colors duration-300 ease-out hover:border-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:grid-cols-[0.9fr_1.1fr]"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-background sm:aspect-auto sm:min-h-[240px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={commission.image.src}
                        alt={commission.image.alt}
                        width={commission.image.width}
                        height={commission.image.height}
                        loading="lazy"
                        decoding="async"
                        style={
                          commission.image.objectPosition
                            ? {
                                objectPosition:
                                  commission.image.objectPosition,
                              }
                            : undefined
                        }
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-col p-5 md:p-6">
                      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                        {commission.category} · {commission.location}
                      </p>
                      <h3 className="mt-2 font-serif text-xl leading-snug">
                        {commission.name}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/80">
                        {commission.deliverable}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {commission.summary}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs tracking-[0.06em] text-foreground underline-offset-4 group-hover:underline">
                        <Maximize2 className="size-3" aria-hidden="true" />
                        View larger
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="border-t border-border"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted uppercase">
                Process
              </p>
              <h2
                id="process-heading"
                className="mt-2 font-serif text-2xl md:text-3xl"
              >
                How a commission works
              </h2>
            </div>
            <a
              href="#quote"
              className="inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Back to quote form
              <ArrowUp className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="border-t border-foreground/20 pt-5"
              >
                <span className="text-xs tabular-nums tracking-[0.14em] text-muted">
                  {step.number}
                </span>
                <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProjectLightbox
        items={activeCommission ? [activeCommission.image] : []}
        index={activeCommission ? 0 : null}
        title={activeCommission?.name ?? ""}
        eyebrow={
          activeCommission
            ? `${activeCommission.category} · ${activeCommission.location}`
            : undefined
        }
        onIndexChange={() => {}}
        onClose={() => setActiveCommission(null)}
      />
    </>
  );
}
