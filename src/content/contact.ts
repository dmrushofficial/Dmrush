import { ctas, siteConfig } from "@/lib/site";

export const contactPage = {
  metaTitle: "Contact DMrush",
  metaDescription:
    "Book a strategy call or request a free website and SEO audit from DMrush.",
  hero: {
    eyebrow: "Contact",
    title: "Let's find what's holding back your growth.",
    body: "Tell us about your business, your current digital presence, and what you want to improve. We'll come back with clear next steps.",
  },
  form: {
    title: "Send a message",
    body: "Use this form for a strategy call or a free website and SEO audit.",
  },
  nextSteps: {
    eyebrow: "What happens next",
    title: "A clear path from first message to priorities.",
    items: [
      {
        number: "01",
        title: "You share context",
        body: "Business goals, website, service area, and the channel you care about most.",
      },
      {
        number: "02",
        title: "We review the landscape",
        body: "A quick look at visibility, site quality, and where growth is leaking.",
      },
      {
        number: "03",
        title: "We outline next steps",
        body: "A practical recommendation — SEO, web, ads, or a connected plan.",
      },
    ],
  },
  aside: {
    title: "Direct contact",
    emailLabel: "Email",
    email: siteConfig.email,
    note: "WhatsApp is the fastest way to reach us. Walk-ins welcome at the Pattoki office.",
    ctas: [ctas.primary, ctas.secondary],
  },
} as const;
