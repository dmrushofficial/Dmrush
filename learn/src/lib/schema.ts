import { siteConfig } from "@/lib/site";
import type { Course } from "@/content/courses";

export type JsonLdNode = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

export function jsonLdGraph(nodes: JsonLdNode[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function breadcrumbNode(
  items: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseNode(course: Course): JsonLdNode {
  const url = absoluteUrl(`/courses/${course.slug}`);
  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: course.title,
    description: course.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      name: siteConfig.institute,
      url: siteConfig.url,
    },
    educationalLevel: course.level,
    timeRequired: course.duration,
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      category: "On-campus professional training",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/contact?course=${course.slug}`),
    },
  };
}

export function faqPageNode(
  items: Array<{ question: string; answer: string }>,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
