export const services = [
  {
    slug: "seo",
    href: "/seo",
    name: "SEO",
    shortName: "SEO",
    navLabel: "SEO",
    title: "SEO",
    description:
      "Organic search strategy that builds compounding visibility through technical SEO, content, and authority.",
    summary:
      "Keyword strategy, technical SEO, on-page optimization, content systems, authority, and measurement for durable organic growth.",
    homeSummary:
      "Build search visibility that compounds through technical foundations, content, and authority.",
    primary: true,
  },
  {
    slug: "web-development",
    href: "/web-development",
    name: "Web Design & Development",
    shortName: "Web Development",
    navLabel: "Web Development",
    title: "Web Design & Development",
    description:
      "Custom websites built for performance, SEO foundations, and conversion — not generic templates.",
    summary:
      "Custom design, responsive development, performance, SEO foundations, conversion UX, and scalable builds.",
    homeSummary:
      "Premium websites designed and developed to turn attention into action.",
    primary: true,
  },
  {
    slug: "ecommerce-development",
    href: "/ecommerce-development",
    name: "Ecommerce Development",
    shortName: "Ecommerce",
    navLabel: "Ecommerce Development",
    title: "Ecommerce Development",
    description:
      "Ecommerce experiences designed to sell — product UX, checkout, performance, and technical SEO.",
    summary:
      "Ecommerce development, product experience, mobile commerce, checkout UX, performance, and technical SEO.",
    homeSummary:
      "Ecommerce experiences designed for product clarity, checkout flow, and conversion.",
    primary: true,
  },
  {
    slug: "google-ads",
    href: "/google-ads",
    name: "Google Ads",
    shortName: "Google Ads",
    navLabel: "Google Ads",
    title: "Google Ads",
    description:
      "Paid search campaigns that capture demand when customers are ready to act.",
    summary:
      "Search campaigns, keyword targeting, landing page alignment, conversion tracking, and ongoing optimization.",
    homeSummary:
      "Capture high-intent demand with Search campaigns, landing pages, and conversion tracking.",
    primary: true,
  },
  {
    slug: "digital-marketing",
    href: "/digital-marketing",
    name: "Digital Marketing",
    shortName: "Digital Marketing",
    navLabel: "Digital Marketing",
    title: "Digital Marketing",
    description:
      "Integrated digital growth across search, website, paid media, and conversion strategy.",
    summary:
      "Connected growth planning across SEO, websites, ecommerce, paid search, and conversion systems.",
    homeSummary:
      "A connected growth plan across search, website, paid media, and conversion.",
    primary: true,
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    throw new Error(`Unknown service: ${slug}`);
  }

  return service;
}

export const primaryServices = services.filter((service) => service.primary);
