export const siteConfig = {
  name: "DMrush",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dmrush.com",
  learnUrl: "https://learn.dmrush.com",
  locale: "en_US",
  tagline: "SEO, web development, and digital growth for modern businesses.",
  description:
    "DMrush is a digital growth agency helping businesses get found, get chosen, and grow through SEO, web development, ecommerce, and paid acquisition.",
  email: "dmrushofficial@gmail.com",
  phone: "+923017786667",
  phoneDisplay: "+92 301 7786667",
  whatsappUrl: "https://wa.me/923017786667",
  address: "Flat # 101 Burj AlGhori Plaza, Faisal Colony Pattoki",
  social: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/dmrushofficial/" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@DMRushofficial" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/dmrushofficial/" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/dm-rush-institute" },
  ],
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
