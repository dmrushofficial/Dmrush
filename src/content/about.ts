import { ctas, siteConfig } from "@/lib/site";

export const aboutPage = {
  metaTitle: "About DMrush",
  metaDescription:
    "DMrush is a digital growth agency combining SEO, web development, ecommerce, and paid acquisition under one roof.",
  hero: {
    eyebrow: "About DMrush",
    title: "Strategy, search, and technology working as one.",
    body: "DMrush helps businesses get found, get chosen, and grow — by connecting SEO, high-performing websites, ecommerce, and paid acquisition into one clear growth system.",
  },
  story: {
    eyebrow: "Who we are",
    title: "A growth partner, not a collection of disconnected tactics.",
    body: "Too many businesses buy SEO from one vendor, a website from another, and ads from a third — then wonder why messaging, tracking, and results never line up. DMrush was built to keep strategy and execution connected.",
    points: [
      {
        title: "Search-first thinking",
        body: "We start from how customers actually discover and evaluate businesses online.",
      },
      {
        title: "Development-backed delivery",
        body: "Visibility only pays off when the website experience is fast, clear, and ready to convert.",
      },
      {
        title: "Outcome-focused work",
        body: "We care about leads, sales, and durable growth — not vanity rankings or busywork.",
      },
    ],
  },
  approach: {
    eyebrow: "How we think",
    title: "One system across discovery, experience, and conversion.",
    items: [
      {
        number: "01",
        title: "Discover",
        body: "Audit visibility, website quality, competition, and conversion paths.",
      },
      {
        number: "02",
        title: "Prioritize",
        body: "Sequence SEO, web, ecommerce, and paid work around the highest leverage.",
      },
      {
        number: "03",
        title: "Build",
        body: "Execute foundations — pages, technical work, campaigns, and tracking.",
      },
      {
        number: "04",
        title: "Compound",
        body: "Improve continuously based on visibility, traffic quality, and outcomes.",
      },
    ],
  },
  beliefs: {
    eyebrow: "What we believe",
    title: "Principles that shape every engagement.",
    items: [
      {
        title: "No invented claims",
        body: "We do not publish fake awards, inflated metrics, or unverified case studies.",
      },
      {
        title: "Clarity over jargon",
        body: "Strategy should be understandable. If a plan cannot be explained simply, it is not ready.",
      },
      {
        title: "Channels should reinforce each other",
        body: "Organic, paid, and website work belong in one system — not competing silos.",
      },
      {
        title: "Learning stays connected",
        body: `Through ${siteConfig.name} Learn, we share practical training without turning the agency site into a school.`,
      },
    ],
  },
  finalCta: {
    title: "Want to see if DMrush is the right fit?",
    body: "Start with a strategy call or a free website and SEO audit — and get a clear view of where growth is stuck.",
    primary: ctas.primary,
    secondary: ctas.secondary,
  },
} as const;
