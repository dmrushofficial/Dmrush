import { notFound } from "next/navigation";
import { CaseStudyDetail } from "@/components/page/CaseStudyDetail";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return createPageMetadata({
    title: study.title,
    description: study.summary,
    path: study.href,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyDetail study={study} />;
}
