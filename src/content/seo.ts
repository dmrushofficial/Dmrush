import { ctas } from "@/lib/site";

export const seoPage = {
  metaTitle: "SEO Services",
  metaDescription:
    "DMrush SEO services for compounding organic visibility — technical SEO, keyword strategy, on-page optimization, content systems, and measurement.",
  hero: {
    eyebrow: "SEO Services",
    title: "Build search visibility that compounds over time.",
    body: "DMrush builds organic search systems — technical foundations, content, and authority — so your website earns visibility that grows instead of resetting every campaign cycle.",
    primaryCta: ctas.primary,
    secondaryCta: ctas.secondary,
  },
  proofStrip: [
    "Technical SEO",
    "Keyword strategy",
    "On-page SEO",
    "Content systems",
    "Authority",
    "Measurement",
  ],
  problem: {
    eyebrow: "Why SEO stalls",
    title: "Traffic without structure does not become durable growth.",
    body: "Many businesses publish pages without a clear keyword system, technical health, or internal linking plan. The result is inconsistent rankings and traffic that never compounds.",
    points: [
      {
        title: "Technical gaps block progress",
        body: "Crawl issues, slow pages, and weak indexation quietly limit visibility.",
      },
      {
        title: "Content without strategy wastes effort",
        body: "Pages that do not match search intent fail to rank or convert.",
      },
      {
        title: "Authority takes deliberate work",
        body: "Internal structure and external trust signals need a planned approach.",
      },
    ],
  },
  pillars: {
    eyebrow: "The SEO system",
    title: "Four pillars that work together.",
    items: [
      {
        number: "01",
        title: "Technical foundations",
        body: "Crawlability, indexation, site architecture, speed, and structural health.",
      },
      {
        number: "02",
        title: "Search intent mapping",
        body: "Keyword priorities tied to real demand and business value — not vanity volume.",
      },
      {
        number: "03",
        title: "On-page & content",
        body: "Pages and topic systems designed to rank, clarify offers, and convert.",
      },
      {
        number: "04",
        title: "Authority & measurement",
        body: "Trust signals and reporting that keep growth accountable over time.",
      },
    ],
  },
  includes: {
    eyebrow: "What's included",
    title: "A complete SEO engagement — not random page tweaks.",
    items: [
      {
        title: "SEO audit & opportunity map",
        body: "Technical, content, and competitive gaps prioritized by impact.",
      },
      {
        title: "Keyword strategy",
        body: "Intent-based keyword themes mapped to pages and growth goals.",
      },
      {
        title: "Technical SEO",
        body: "Indexation, crawl paths, structure, performance, and foundational fixes.",
      },
      {
        title: "On-page optimization",
        body: "Titles, headings, content structure, internal links, and clarity.",
      },
      {
        title: "Content systems",
        body: "Topic clusters and page types that support sustained organic growth.",
      },
      {
        title: "Reporting & iteration",
        body: "Visibility and outcome tracking that guides continuous improvement.",
      },
    ],
  },
  audience: {
    eyebrow: "Who it's for",
    title: "Built for businesses ready to invest in compounding search growth.",
    items: [
      "Companies that need organic demand beyond paid campaigns",
      "Teams with an existing website that is underperforming in search",
      "Businesses planning a redesign and want SEO built correctly from the start",
      "Brands ready for a structured roadmap instead of one-off SEO tasks",
    ],
  },
  process: {
    eyebrow: "How we work",
    title: "From SEO audit to compounding execution.",
    steps: [
      {
        number: "01",
        title: "Audit",
        body: "Assess technical health, content gaps, competitors, and ranking opportunities.",
      },
      {
        number: "02",
        title: "Strategy",
        body: "Define priorities across technical fixes, pages, and content themes.",
      },
      {
        number: "03",
        title: "Build",
        body: "Implement on-page, technical, and content improvements in sequence.",
      },
      {
        number: "04",
        title: "Compound",
        body: "Iterate with measurement so visibility strengthens over time.",
      },
    ],
  },
  midCta: {
    title: "Not sure where SEO should start?",
    body: "We'll review your search landscape and recommend the highest-leverage starting point.",
    primary: ctas.secondary,
    secondary: ctas.primary,
  },
  outcomes: {
    eyebrow: "What success looks like",
    title: "Clearer structure. Stronger rankings. More qualified organic demand.",
    items: [
      "A prioritized keyword and page roadmap",
      "Healthier technical foundations for crawl and indexation",
      "Pages aligned to search intent and conversion",
      "Content that supports long-term organic growth",
      "Internal linking that distributes relevance",
      "Reporting focused on visibility and business impact",
    ],
  },
  faq: {
    title: "SEO questions businesses ask",
    items: [
      {
        question: "What does an SEO engagement with DMrush include?",
        answer:
          "Technical SEO, keyword strategy, on-page optimization, content systems, authority planning, and measurement — sequenced around your growth priorities.",
      },
      {
        question: "Do you only do technical SEO?",
        answer:
          "No. Technical SEO is foundational, but we also cover keyword strategy, on-page work, content systems, and reporting.",
      },
      {
        question: "Does SEO include local search?",
        answer:
          "Yes when it matters for the business. We can include Maps, Google Business Profile, and location-focused pages as part of the SEO plan.",
      },
      {
        question: "Can you work with our existing website?",
        answer:
          "Yes. We can improve an existing site or coordinate SEO with a redesign when structure and performance need deeper work.",
      },
      {
        question: "How long before results appear?",
        answer:
          "Some technical and on-page improvements show sooner. Meaningful organic growth usually compounds across months of consistent execution.",
      },
      {
        question: "Do you create content?",
        answer:
          "We build content strategy and page systems. Writing support depends on the engagement scope defined during planning.",
      },
      {
        question: "Can SEO work with Google Ads?",
        answer:
          "Yes. Paid search can capture demand immediately while SEO builds compounding visibility over time.",
      },
      {
        question: "How do we get started?",
        answer:
          "Book a strategy call or request a free website and SEO audit.",
      },
    ],
  },
  finalCta: {
    title: "Ready to finish building real organic growth?",
    body: "Let's review your technical foundations, content opportunities, and ranking priorities — then map a clear SEO plan.",
    primary: ctas.primary,
    secondary: ctas.secondary,
  },
} as const;
