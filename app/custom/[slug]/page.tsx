import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnershipPage } from "@/components/custom/partnership-page";
import {
  caseStudies,
  getCaseStudy,
  getNextCaseStudy,
} from "@/lib/partnerships";

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/custom/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getCaseStudy(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.story,
  };
}

export default async function Page(props: PageProps<"/custom/[slug]">) {
  const { slug } = await props.params;
  const project = getCaseStudy(slug);
  if (!project) notFound();
  const nextProject = getNextCaseStudy(project.slug);
  return <PartnershipPage project={project} nextProject={nextProject} />;
}
