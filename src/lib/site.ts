export const siteConfig = {
  name: "DMrush",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dmrush.com",
  learnUrl: "https://learn.dmrush.com",
  locale: "en_US",
  tagline: "SEO, web development, and digital growth for modern businesses.",
  description:
    "DMrush is a digital growth agency helping businesses get found, get chosen, and grow through SEO, web development, ecommerce, and paid acquisition.",
  email: "support@dmrush.com",
} as const;

export const ctas = {
  primary: {
    label: "Book a Strategy Call",
    href: "/contact",
  },
  secondary: {
    label: "Get a Free Website & SEO Audit",
    href: "/contact",
  },
} as const;
