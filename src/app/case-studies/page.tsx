import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/content/case-studies";
import { pages } from "@/content/pages";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { ctas } from "@/lib/site";

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
      <PageHero
        eyebrow="Case Studies"
        title="Work that connects visibility to growth."
        body="Three recent projects — local search, ecommerce catalog, and a service website. Client branding is kept off the snapshots."
        image={{
          src: "/images/case-studies/local-clinic.jpg",
          alt: "Phone on a desk showing a local clinic Maps listing",
        }}
        primaryCta={ctas.primary}
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
