import { siteConfig } from "@/lib/site";
import { services } from "@/content/services";

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  separated?: boolean;
};

export type NavItem =
  | NavLink
  | {
      label: string;
      children: NavLink[];
    };

export const primaryNav: NavItem[] = [
  {
    label: "Services",
    children: services.map((service) => ({
      label: service.navLabel,
      href: service.href,
    })),
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Learn", href: siteConfig.learnUrl, external: true },
];

export const footerNav = {
  services: services.map((service) => ({
    label: service.navLabel,
    href: service.href,
  })) satisfies NavLink[],
  company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],
  resources: [
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
    { label: "Get a Free Audit", href: "/contact" },
  ] satisfies NavLink[],
  learn: [
    { label: "DMrush Learn", href: siteConfig.learnUrl, external: true },
  ] satisfies NavLink[],
};
