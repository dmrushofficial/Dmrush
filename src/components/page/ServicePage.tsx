import { CtaSection } from "@/components/ui/CtaSection";
import { Faq } from "@/components/ui/Faq";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, type ServiceSlug } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";
import {
  breadcrumbNode,
  serviceNode,
  webPageNode,
} from "@/lib/schema";

const placeholderFaqs = [
  {
    question: "Who is this service for?",
    answer:
      "Businesses that need clearer search visibility, stronger websites, or more accountable paid growth. Full service details will be expanded in a later content phase.",
  },
  {
    question: "What happens after we talk?",
    answer:
      "We review your current visibility, website, and opportunities, then outline priorities. Engagement details will be confirmed during intake.",
  },
];

export function serviceMetadata(slug: ServiceSlug) {
  const service = getService(slug);

  return createPageMetadata({
    title: service.title,
    description: service.description,
    path: service.href,
  });
}

type ServicePageProps = {
  slug: ServiceSlug;
};

export function ServicePage({ slug }: ServicePageProps) {
  const service = getService(slug);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services" },
    { label: service.name },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: service.title,
            description: service.description,
            path: service.href,
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: service.name, path: service.href },
          ]),
          serviceNode({
            name: service.name,
            description: service.description,
            path: service.href,
          }),
        ]}
      />
      <PageHeader
        title={service.title}
        description={service.description}
        crumbs={crumbs}
      />
      <Section>
        <p className="max-w-2xl text-base leading-7 text-muted">
          {service.summary}
        </p>
      </Section>
      <Section spacing="moderate">
        <Faq items={placeholderFaqs} />
      </Section>
      <CtaSection />
    </>
  );
}
