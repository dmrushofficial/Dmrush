export const siteConfig = {
  name: "DMrush Learn",
  shortName: "DMrush Learn",
  institute: "DMrush Institute",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://learn.dmrush.com",
  agencyUrl: "https://dmrush.com",
  agencyLabel: "DMrush Agency",
  email: "learn@dmrush.com",
  locale: "en_US",
  tagline: "Practical digital skills for modern careers.",
  description:
    "DMrush Institute offers live physical classes in SEO, WordPress, Shopify, AI tools, digital marketing, and AI website building — with online notes, assignments, attendance, and certificates.",
} as const;

export const publicNav = [
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
