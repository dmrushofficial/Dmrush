import { ctas } from "@/lib/site";
import type { ServiceSlug } from "@/content/services";

export type ServiceLandingContent = {
  metaTitle: string;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    imageAlt: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  problem: {
    eyebrow: string;
    title: string;
    body: string;
    points: Array<{ title: string; body: string }>;
  };
  includes: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    steps: Array<{ number: string; title: string; body: string }>;
  };
  outcomes: {
    eyebrow: string;
    title: string;
    items: string[];
    pathLabel: string;
    path: string[];
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    title: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

const ctaPair = {
  primaryCta: ctas.primary,
  secondaryCta: ctas.secondary,
};

export const serviceLandings: Record<ServiceSlug, ServiceLandingContent> = {
  seo: {
    metaTitle: "SEO Services",
    hero: {
      eyebrow: "SEO",
      title: "Build search visibility that compounds over time.",
      body: "DMrush develops organic search systems — technical foundations, content, and authority — so your website earns visibility that grows instead of resetting every month.",
      image: "/images/home/seo-growth.png",
      imageAlt: "Organic SEO growth analytics on a modern workstation",
      ...ctaPair,
    },
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
    includes: {
      eyebrow: "What's included",
      title: "SEO built as a system — technical, on-page, and content together.",
      items: [
        {
          title: "Keyword strategy",
          body: "Prioritized opportunities based on demand, intent, and business value.",
        },
        {
          title: "Technical SEO",
          body: "Crawlability, indexation, site structure, speed, and foundational health.",
        },
        {
          title: "On-page optimization",
          body: "Titles, content structure, internal links, and page-level clarity.",
        },
        {
          title: "Content systems",
          body: "Topic planning and page types that support sustained organic growth.",
        },
        {
          title: "Authority building",
          body: "Practical approaches to strengthen trust and competitive standing.",
        },
        {
          title: "Measurement",
          body: "Tracking that connects rankings and traffic to meaningful outcomes.",
        },
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
      pathLabel: "Organic growth path",
      path: ["Search intent", "Visibility", "Website visit", "Trust", "Conversion"],
    },
    faq: {
      title: "SEO questions",
      items: [
        {
          question: "Do you only do technical SEO?",
          answer:
            "No. Technical SEO is foundational, but we also cover keyword strategy, on-page work, content systems, and measurement.",
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
          question: "How do we get started?",
          answer:
            "Book a strategy call or request a free website and SEO audit.",
        },
      ],
    },
    finalCta: {
      title: "Ready to build stronger organic visibility?",
      body: "Let's review your technical foundations, content opportunities, and ranking priorities.",
      primary: ctas.primary,
      secondary: ctas.secondary,
    },
  },

  "web-development": {
    metaTitle: "Web Design & Development",
    hero: {
      eyebrow: "Web Development",
      title: "Websites built to turn attention into action.",
      body: "DMrush designs and develops high-performing websites with SEO foundations, clear UX, and conversion paths — so search and ads have somewhere strong to land.",
      image: "/images/home/web-dev.png",
      imageAlt: "Desktop and mobile website design showcase",
      ...ctaPair,
    },
    problem: {
      eyebrow: "Where websites fail",
      title: "A beautiful site that cannot convert is still an expensive problem.",
      body: "Traffic is wasted when pages are slow, unclear, or disconnected from search intent. Websites need to perform as products — not just visual presentations.",
      points: [
        {
          title: "Performance affects everything",
          body: "Slow load times hurt both rankings and conversion rates.",
        },
        {
          title: "Structure decides clarity",
          body: "Weak information architecture makes services hard to understand and hard to find.",
        },
        {
          title: "SEO must be built in",
          body: "Retrofitting foundations later is more expensive than designing them correctly.",
        },
      ],
    },
    includes: {
      eyebrow: "What's included",
      title: "Design and development with growth in mind.",
      items: [
        {
          title: "Custom design",
          body: "Brand-aligned interfaces that feel premium and purposeful.",
        },
        {
          title: "Responsive development",
          body: "Clean builds that work across desktop, tablet, and mobile.",
        },
        {
          title: "Performance",
          body: "Speed-conscious implementation for better UX and search readiness.",
        },
        {
          title: "SEO foundations",
          body: "Technical structure, metadata patterns, and crawl-friendly architecture.",
        },
        {
          title: "Conversion UX",
          body: "Clear calls to action, forms, and paths that support leads and sales.",
        },
        {
          title: "Scalable builds",
          body: "Systems that can expand with new services, pages, and campaigns.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From discovery to launch-ready delivery.",
      steps: [
        {
          number: "01",
          title: "Discover",
          body: "Clarify goals, audiences, offers, and requirements for the website.",
        },
        {
          number: "02",
          title: "Design",
          body: "Shape structure and visual direction around clarity and conversion.",
        },
        {
          number: "03",
          title: "Build",
          body: "Develop a performant, responsive site with SEO foundations included.",
        },
        {
          number: "04",
          title: "Launch",
          body: "Ship cleanly with tracking, QA, and a plan for ongoing improvement.",
        },
      ],
    },
    outcomes: {
      eyebrow: "What success looks like",
      title: "A website that supports search, trust, and conversion.",
      items: [
        "A modern site aligned to your brand and offers",
        "Mobile experiences that feel intentional",
        "Faster pages with cleaner technical foundations",
        "Clear conversion paths for calls, forms, and inquiries",
        "Architecture ready for SEO and paid campaigns",
        "A platform you can expand without starting over",
      ],
      pathLabel: "Website conversion path",
      path: ["Visit", "Clarity", "Trust", "Action", "Lead / sale"],
    },
    faq: {
      title: "Web development questions",
      items: [
        {
          question: "Do you redesign existing websites?",
          answer:
            "Yes. We can improve or fully rebuild existing sites when performance, UX, or structure is holding growth back.",
        },
        {
          question: "Is SEO included in web development?",
          answer:
            "SEO foundations are part of the build. Ongoing SEO campaigns can be added as a connected service.",
        },
        {
          question: "Do you build on a specific platform?",
          answer:
            "We choose the stack based on project needs. The priority is performance, maintainability, and growth readiness.",
        },
        {
          question: "Can you integrate forms and tracking?",
          answer:
            "Yes. Forms, call paths, and conversion tracking are planned as part of launch readiness.",
        },
        {
          question: "How long does a website project take?",
          answer:
            "Timelines depend on scope. During discovery we outline phases so design, build, and launch stay clear.",
        },
        {
          question: "How do we get started?",
          answer:
            "Book a strategy call or request a free website and SEO audit.",
        },
      ],
    },
    finalCta: {
      title: "Ready for a website that converts?",
      body: "Let's review your current site experience, performance, and conversion opportunities.",
      primary: ctas.primary,
      secondary: ctas.secondary,
    },
  },

  "ecommerce-development": {
    metaTitle: "Ecommerce Development",
    hero: {
      eyebrow: "Ecommerce",
      title: "Ecommerce experiences designed to sell.",
      body: "DMrush builds ecommerce websites focused on product clarity, mobile commerce, checkout UX, performance, and technical SEO — so traffic has a real path to purchase.",
      image: "/images/home/ecommerce.png",
      imageAlt: "Ecommerce product experience and storefront interface",
      ...ctaPair,
    },
    problem: {
      eyebrow: "Where stores lose sales",
      title: "Traffic means little if the buying experience creates friction.",
      body: "Ecommerce growth depends on more than product catalogs. Slow pages, weak mobile UX, and confusing checkout flows quietly reduce conversion.",
      points: [
        {
          title: "Product experience must be clear",
          body: "Customers need fast answers on options, value, and trust.",
        },
        {
          title: "Mobile is the storefront",
          body: "Most shoppers browse and buy on phones — UX has to match that reality.",
        },
        {
          title: "Technical SEO still matters",
          body: "Indexable structure and performance help products get discovered.",
        },
      ],
    },
    includes: {
      eyebrow: "What's included",
      title: "Ecommerce built for discovery, trust, and conversion.",
      items: [
        {
          title: "Ecommerce development",
          body: "Storefront architecture designed around your catalog and sales model.",
        },
        {
          title: "Product experience",
          body: "Clear product pages, variants, and merchandising patterns.",
        },
        {
          title: "Mobile commerce",
          body: "Responsive shopping flows optimized for speed and usability.",
        },
        {
          title: "Checkout UX",
          body: "Friction-reducing paths from cart to completed purchase.",
        },
        {
          title: "Performance",
          body: "Faster browsing and checkout experiences that protect conversion.",
        },
        {
          title: "Technical SEO",
          body: "Foundations that help categories and products get found in search.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From store requirements to a launch-ready commerce experience.",
      steps: [
        {
          number: "01",
          title: "Discover",
          body: "Map catalog needs, customer journeys, and conversion goals.",
        },
        {
          number: "02",
          title: "Design",
          body: "Shape product, category, and checkout experiences for clarity.",
        },
        {
          number: "03",
          title: "Build",
          body: "Develop a performant storefront with SEO and tracking foundations.",
        },
        {
          number: "04",
          title: "Optimize",
          body: "Improve conversion and discoverability after launch with iteration.",
        },
      ],
    },
    outcomes: {
      eyebrow: "What success looks like",
      title: "A store that is easier to browse, trust, and buy from.",
      items: [
        "A commerce experience aligned to your products and buyers",
        "Clearer product and category journeys",
        "Stronger mobile shopping UX",
        "Checkout flows with less unnecessary friction",
        "Better performance across browse and purchase paths",
        "Technical SEO foundations for organic discovery",
      ],
      pathLabel: "Ecommerce purchase path",
      path: ["Discover", "Browse", "Product", "Checkout", "Purchase"],
    },
    faq: {
      title: "Ecommerce questions",
      items: [
        {
          question: "Can you rebuild an existing store?",
          answer:
            "Yes. We can improve or rebuild ecommerce experiences when UX, performance, or structure is limiting sales.",
        },
        {
          question: "Do you handle migrations?",
          answer:
            "Migrations can be planned as part of the project scope when moving platforms or restructuring catalogs.",
        },
        {
          question: "Is SEO included for ecommerce?",
          answer:
            "Technical SEO foundations are included. Ongoing SEO or ads can connect as additional growth services.",
        },
        {
          question: "Do you optimize checkout conversion?",
          answer:
            "Yes. Checkout UX and mobile flow quality are core parts of ecommerce development.",
        },
        {
          question: "Can ecommerce work with Google Ads?",
          answer:
            "Yes. Paid acquisition performs better when product and landing experiences are conversion-ready.",
        },
        {
          question: "How do we get started?",
          answer:
            "Book a strategy call or request a free website and SEO audit.",
        },
      ],
    },
    finalCta: {
      title: "Ready to improve your ecommerce experience?",
      body: "Let's review your storefront, product journey, and checkout friction points.",
      primary: ctas.primary,
      secondary: ctas.secondary,
    },
  },

  "google-ads": {
    metaTitle: "Google Ads Management",
    hero: {
      eyebrow: "Google Ads",
      title: "Capture demand when customers are ready to act.",
      body: "DMrush builds Search campaigns connected to landing pages and conversion tracking — so paid spend stays focused on intent, not vanity clicks.",
      image: "/images/home/google-ads.png",
      imageAlt: "Paid search ad experience on mobile",
      ...ctaPair,
    },
    problem: {
      eyebrow: "Where paid search wastes budget",
      title: "Clicks without conversion systems become expensive noise.",
      body: "Google Ads fails when keywords are loose, landing pages are weak, or tracking is incomplete. Paid growth needs alignment from intent to action.",
      points: [
        {
          title: "Intent must be precise",
          body: "Broad targeting can spend quickly without producing qualified demand.",
        },
        {
          title: "Landing pages decide ROI",
          body: "Ads that send traffic to unclear pages lose the conversion moment.",
        },
        {
          title: "Tracking is non-negotiable",
          body: "Without clean conversion data, optimization is guesswork.",
        },
      ],
    },
    includes: {
      eyebrow: "What's included",
      title: "Paid search built around intent, pages, and accountability.",
      items: [
        {
          title: "Search campaigns",
          body: "Campaign structures designed around high-intent queries.",
        },
        {
          title: "Keyword targeting",
          body: "Keyword themes, match strategy, and negative keyword discipline.",
        },
        {
          title: "Landing page alignment",
          body: "Message match between ads and destination experiences.",
        },
        {
          title: "Conversion tracking",
          body: "Measurement setup so leads and sales can be evaluated clearly.",
        },
        {
          title: "Ongoing optimization",
          body: "Continuous improvement based on query quality and conversion signals.",
        },
        {
          title: "Reporting",
          body: "Clear reporting focused on demand quality and outcomes.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From account foundations to continuous optimization.",
      steps: [
        {
          number: "01",
          title: "Audit",
          body: "Review account structure, tracking, keywords, and landing page fit.",
        },
        {
          number: "02",
          title: "Build",
          body: "Set up campaigns, targeting, and conversion measurement correctly.",
        },
        {
          number: "03",
          title: "Launch",
          body: "Release campaigns with controls that protect spend quality.",
        },
        {
          number: "04",
          title: "Optimize",
          body: "Iterate on queries, creatives, bids, and page alignment.",
        },
      ],
    },
    outcomes: {
      eyebrow: "What success looks like",
      title: "Cleaner targeting. Stronger intent capture. Better accountability.",
      items: [
        "Campaigns structured around real search intent",
        "Keyword strategy with waste controls",
        "Landing pages aligned to ad promises",
        "Conversion tracking you can trust",
        "Optimization loops based on performance signals",
        "Reporting that clarifies what spend is producing",
      ],
      pathLabel: "Paid search path",
      path: ["Search intent", "Ad", "Landing page", "Conversion", "Growth"],
    },
    faq: {
      title: "Google Ads questions",
      items: [
        {
          question: "Do you manage existing Google Ads accounts?",
          answer:
            "Yes. We can rebuild or optimize existing accounts when structure, tracking, or targeting needs work.",
        },
        {
          question: "Do you invent ROAS or CPL promises?",
          answer:
            "No. We focus on clean systems and accountable optimization rather than fabricated performance guarantees.",
        },
        {
          question: "Can Google Ads work with SEO?",
          answer:
            "Yes. Paid search captures demand now while SEO builds compounding visibility over time.",
        },
        {
          question: "Do you create landing pages?",
          answer:
            "Landing page alignment is part of the system. New pages can be planned through web development when needed.",
        },
        {
          question: "What budgets do you work with?",
          answer:
            "Budget fit depends on market competitiveness and goals. We discuss realistic ranges during strategy conversations.",
        },
        {
          question: "How do we get started?",
          answer:
            "Book a strategy call or request a free website and SEO audit.",
        },
      ],
    },
    finalCta: {
      title: "Ready to make paid search more accountable?",
      body: "Let's review your campaigns, tracking, and landing page alignment.",
      primary: ctas.primary,
      secondary: ctas.secondary,
    },
  },

  "digital-marketing": {
    metaTitle: "Digital Marketing Services",
    hero: {
      eyebrow: "Digital Marketing",
      title: "One growth plan across search, web, and paid channels.",
      body: "DMrush connects SEO, websites, ecommerce, and Google Ads into a single growth system — so channels reinforce each other instead of competing.",
      image: "/images/home/strategy.png",
      imageAlt: "Digital growth strategy workspace",
      ...ctaPair,
    },
    problem: {
      eyebrow: "The fragmentation problem",
      title: "Separate vendors create separate strategies — and disconnected results.",
      body: "When SEO, ads, and website work happen in silos, messaging drifts, tracking breaks, and growth becomes harder to manage. Digital marketing should operate as one system.",
      points: [
        {
          title: "Channels need shared goals",
          body: "Organic, paid, and website work should point to the same outcomes.",
        },
        {
          title: "Experience must stay consistent",
          body: "Search promises and website reality have to match.",
        },
        {
          title: "Measurement must be unified",
          body: "Lead and sales paths should be visible across the full journey.",
        },
      ],
    },
    includes: {
      eyebrow: "What's included",
      title: "Integrated digital growth planning and execution.",
      items: [
        {
          title: "Channel strategy",
          body: "Prioritize SEO, ads, and web work based on opportunity.",
        },
        {
          title: "Funnel alignment",
          body: "Connect discovery, website experience, and conversion paths.",
        },
        {
          title: "Campaign coordination",
          body: "Keep organic and paid efforts reinforcing the same offers.",
        },
        {
          title: "Conversion systems",
          body: "Improve forms, calls, and page experiences that create leads or sales.",
        },
        {
          title: "Reporting cadence",
          body: "Clear reporting that shows what is working across channels.",
        },
        {
          title: "Ongoing optimization",
          body: "Iterate priorities as visibility, traffic quality, and outcomes change.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From full-funnel diagnosis to connected execution.",
      steps: [
        {
          number: "01",
          title: "Diagnose",
          body: "Review search, website, paid, and conversion gaps as one system.",
        },
        {
          number: "02",
          title: "Plan",
          body: "Sequence channel priorities around the highest-leverage opportunities.",
        },
        {
          number: "03",
          title: "Execute",
          body: "Implement SEO, web, and paid work under a shared strategy.",
        },
        {
          number: "04",
          title: "Optimize",
          body: "Adjust continuously based on visibility, traffic quality, and outcomes.",
        },
      ],
    },
    outcomes: {
      eyebrow: "What success looks like",
      title: "Connected channels. Clearer priorities. Stronger growth systems.",
      items: [
        "A unified digital growth plan across key channels",
        "Search and website work aligned to the same offers",
        "Paid and organic strategies that reinforce each other",
        "Conversion paths designed into the customer journey",
        "Reporting that connects activity to business outcomes",
        "A system that improves continuously instead of restarting",
      ],
      pathLabel: "Integrated growth path",
      path: [
        "Visibility",
        "Website / store",
        "Leads / sales",
        "Learning",
        "Growth",
      ],
    },
    faq: {
      title: "Digital marketing questions",
      items: [
        {
          question: "Is digital marketing a separate package from SEO or ads?",
          answer:
            "Digital marketing is the connected layer. It can include SEO, web, ecommerce, and Google Ads based on what your business needs.",
        },
        {
          question: "Do you work with businesses in different industries?",
          answer:
            "Yes. DMrush works across industries. Industry-specific landing pages can be created later for campaigns when needed.",
        },
        {
          question: "Can you manage only one channel?",
          answer:
            "Yes. You can start with a single service. Digital marketing planning helps decide where to begin.",
        },
        {
          question: "Do you provide fake growth guarantees?",
          answer:
            "No. We focus on clear strategy, execution quality, and measurable systems.",
        },
        {
          question: "How do DMrush Learn and the agency relate?",
          answer:
            "DMrush Learn is our education platform. The agency remains focused on delivering growth services for businesses.",
        },
        {
          question: "How do we get started?",
          answer:
            "Book a strategy call or request a free website and SEO audit.",
        },
      ],
    },
    finalCta: {
      title: "Ready for a connected growth plan?",
      body: "Let's review where your search, website, and paid channels are losing opportunities.",
      primary: ctas.primary,
      secondary: ctas.secondary,
    },
  },
};

export function getServiceLanding(slug: ServiceSlug): ServiceLandingContent {
  return serviceLandings[slug];
}
