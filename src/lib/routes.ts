import { pages } from "@/content/pages";
import { services } from "@/content/services";

export const sitemapRoutes = [
  { path: pages.home.path, changeFrequency: "weekly" as const, priority: 1 },
  ...services.map((service) => ({
    path: service.href,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  {
    path: pages.caseStudies.path,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  { path: pages.about.path, changeFrequency: "monthly" as const, priority: 0.5 },
  { path: pages.team.path, changeFrequency: "monthly" as const, priority: 0.4 },
  {
    path: pages.contact.path,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
];
