import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/metadata";

export type JsonLdNode = Record<string, unknown>;

export function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Flat # 101 Burj AlGhori Plaza, Faisal Colony",
      addressLocality: "Pattoki",
      addressCountry: "PK",
    },
    description: siteConfig.description,
    sameAs: siteConfig.social.map((item) => item.href),
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function webPageNode({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "en-US",
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

export function serviceNode({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Businesses seeking digital growth",
    },
  };
}

export function jsonLdGraph(nodes: JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
