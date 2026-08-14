import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/content/case-studies";
import { pages } from "@/content/pages";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";

export const metadata = createPageMetadata({
  title: pages.caseStudies.title,
  description: pages.caseStudies.description,
  path: pages.caseStudies.path,
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: pages.caseStudies.title,
            description: pages.caseStudies.description,
            path: pages.caseStudies.path,
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: pages.caseStudies.path },
          ]),
        ]}
      />
      <PageHeader
        title={pages.caseStudies.title}
        description={pages.caseStudies.description}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies" },
        ]}
      />
      <Section>
        {caseStudies.length === 0 ? (
          <p className="max-w-2xl text-base leading-7 text-muted">
            Verified case studies will be published here. No results,
            revenue figures, or client names have been invented for this
            foundation.
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        )}
      </Section>
      <CtaSection />
    </>
  );
}
