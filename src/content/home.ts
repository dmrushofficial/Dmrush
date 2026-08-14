import { ctas, siteConfig } from "@/lib/site";

export const homeCopy = {
  hero: {
    eyebrow: "SEO · WEB · PAID GROWTH",
    lines: ["Get Found.", "Get Chosen.", "Grow Faster."],
    body: "DMrush helps businesses grow through search visibility, high-performing websites, and paid acquisition — strategy and execution under one roof.",
    trust: ["Search-first", "Development-backed", "Outcome-focused"],
    primaryCta: ctas.primary,
    secondaryCta: ctas.secondary,
  },
  expertiseStrip: [
    { label: "Organic SEO", desc: "Compound visibility" },
    { label: "Web Development", desc: "Convert traffic" },
    { label: "Ecommerce", desc: "Sell online" },
    { label: "Google Ads", desc: "Capture demand" },
    { label: "Digital Marketing", desc: "Grow connected" },
  ],
  who: {
    eyebrow: "About DMrush",
    title: "Strategy, search and technology",
    titleAccent: "working as one.",
    body: "DMrush combines SEO, development, paid acquisition, and conversion thinking so your digital presence is not a collection of disconnected tactics — it is a growth system.",
    points: [
      {
        title: "Search visibility",
        body: "Organic search planned around real customer intent.",
      },
      {
        title: "Digital products",
        body: "Websites and ecommerce experiences built for performance and action.",
      },
      {
        title: "Paid acquisition",
        body: "Campaigns that capture demand when buyers are ready to act.",
      },
      {
        title: "Conversion focus",
        body: "Every channel points toward measurable business outcomes.",
      },
    ],
  },
  journey: {
    title: "How customers move from",
    titleAccent: "search to growth.",
    steps: [
      { label: "Search", desc: "Intent begins" },
      { label: "Discover", desc: "You appear" },
      { label: "Visit", desc: "Experience matters" },
      { label: "Trust", desc: "Clarity wins" },
      { label: "Convert", desc: "Action happens" },
      { label: "Grow", desc: "Results compound" },
    ],
    channels: [
      "Google Search",
      "Google Maps",
      "Website",
      "Ecommerce",
      "Google Ads",
      "Lead generation",
    ],
  },
  services: {
    eyebrow: "Our Services",
    title: "Everything you need to grow online.",
    items: [
      {
        slug: "seo" as const,
        number: "01",
        featured: true,
        proposition: "Visibility that compounds over time.",
        bullets: [
          "Keyword strategy",
          "Technical SEO",
          "Content systems",
          "Authority building",
        ],
      },
      {
        slug: "web-development" as const,
        number: "02",
        featured: true,
        proposition: "Websites built to convert attention.",
        bullets: [
          "Custom design",
          "Responsive development",
          "Performance",
          "SEO foundations",
        ],
      },
      {
        slug: "ecommerce-development" as const,
        number: "03",
        featured: false,
        proposition: "Experiences designed to sell.",
        bullets: [
          "Product UX",
          "Checkout flow",
          "Mobile commerce",
          "Technical SEO",
        ],
      },
      {
        slug: "google-ads" as const,
        number: "04",
        featured: false,
        proposition: "Capture demand ready to act.",
        bullets: [
          "Search campaigns",
          "Keyword targeting",
          "Landing pages",
          "Conversion tracking",
        ],
      },
      {
        slug: "digital-marketing" as const,
        number: "05",
        featured: false,
        proposition: "Connected growth across channels.",
        bullets: [
          "Channel planning",
          "Funnel strategy",
          "Lead focus",
          "Ongoing optimization",
        ],
      },
    ],
  },
  statement: {
    line1: "Visibility gets you discovered.",
    line2: "Experience gets you chosen.",
  },
  seo: {
    eyebrow: "SEO",
    title: "Build search visibility that compounds over time.",
    body: "Organic growth is not a one-time campaign. We build the technical foundations, content, and internal structure that keep visibility improving.",
    bullets: [
      "Keyword strategy",
      "Technical SEO",
      "On-page SEO",
      "Content systems",
      "Internal linking",
      "Authority & measurement",
    ],
    cta: { label: "Explore SEO", href: "/seo" },
  },
  web: {
    eyebrow: "Web Development",
    title: "Websites built to turn attention into action.",
    body: "Your website is where search, ads, and brand meet. We design and develop experiences that are fast, clear, and ready to convert.",
    bullets: [
      "Custom design",
      "Responsive development",
      "Performance",
      "SEO foundations",
      "Conversion UX",
      "Scalable builds",
    ],
    cta: { label: "Explore Web Development", href: "/web-development" },
  },
  ecommerce: {
    eyebrow: "Ecommerce",
    title: "Ecommerce experiences designed to sell.",
    body: "From product discovery to checkout, we build ecommerce systems that respect performance, mobile behavior, and technical SEO.",
    bullets: [
      "Ecommerce development",
      "Product experience",
      "Mobile commerce",
      "Checkout UX",
      "Performance",
      "Technical SEO",
    ],
    cta: { label: "Explore Ecommerce Development", href: "/ecommerce-development" },
  },
  ads: {
    eyebrow: "Google Ads",
    title: "Capture demand when customers are ready to act.",
    body: "Paid search is most valuable when intent is high. We connect Search campaigns to landing pages and conversion tracking so spend stays accountable.",
    flow: ["Search intent", "Ad", "Landing page", "Conversion"],
    bullets: [
      "Search campaigns",
      "Keyword targeting",
      "Landing pages",
      "Conversion tracking",
      "Ongoing optimization",
    ],
    cta: { label: "Explore Google Ads", href: "/google-ads" },
  },
  system: {
    eyebrow: "The DMrush Growth System",
    title: "One growth system.",
    titleAccent: "Every channel working together.",
    body: "Organic SEO and Google Ads feed the same website or ecommerce experience — and the same path to leads and sales.",
    channels: ["SEO", "Web", "Google Ads"],
    stages: ["Traffic / Visibility", "Website / Ecommerce", "Leads / Sales", "Growth"],
  },
  caseStudies: {
    eyebrow: "Case Studies",
    title: "Work that proves the system.",
    empty:
      "Verified case studies will appear here once projects and outcomes are ready to publish.",
    href: "/case-studies",
  },
  team: {
    eyebrow: "Team",
    title: "The people behind DMrush.",
    empty: "Team profiles will be added once names, roles, and photos are provided.",
    href: "/team",
  },
  learn: {
    eyebrow: "DMrush Learn",
    title: "Learn the skills behind modern digital growth.",
    body: "Through DMrush Learn, we share practical training in SEO, ecommerce, WordPress, AI tools, digital marketing, and AI website building — without turning this agency site into a school.",
    topics: [
      "Global SEO",
      "Local SEO",
      "Shopify & E-Commerce",
      "WordPress",
      "AI Tools",
      "SaaS AI",
      "Digital Marketing",
      "AI Website Building",
    ],
    cta: { label: "Explore DMrush Learn", href: siteConfig.learnUrl },
  },
  why: {
    eyebrow: "Why DMrush",
    title: "Built for businesses that want serious digital growth.",
    items: [
      {
        number: "01",
        title: "Search-first growth thinking",
        body: "We start from how customers actually discover and evaluate businesses online.",
      },
      {
        number: "02",
        title: "Strategy and execution under one roof",
        body: "Planning and delivery stay connected — not handed off into disconnected silos.",
      },
      {
        number: "03",
        title: "SEO and development built together",
        body: "Visibility and experience are designed as one system, not competing priorities.",
      },
      {
        number: "04",
        title: "Focus on measurable business outcomes",
        body: "We care about leads, sales, and sustainable growth — not vanity metrics.",
      },
    ],
  },
  midCta: {
    title: "Let's find what's holding back your growth.",
    body: "Review search visibility, website performance, and paid opportunities in one strategy conversation.",
    primary: ctas.secondary,
    secondary: ctas.primary,
  },
  process: {
    eyebrow: "How We Work",
    title: "From first conversation to continuous growth.",
    steps: [
      {
        number: "01",
        title: "Discover",
        body: "We audit visibility, website quality, competition, and conversion paths.",
      },
      {
        number: "02",
        title: "Strategy",
        body: "We define priorities across SEO, development, and paid channels.",
      },
      {
        number: "03",
        title: "Build",
        body: "We execute the foundation — pages, technical work, campaigns, and systems.",
      },
      {
        number: "04",
        title: "Launch",
        body: "We ship cleanly, track properly, and align every channel to the same goals.",
      },
      {
        number: "05",
        title: "Optimize",
        body: "We improve continuously based on visibility, traffic quality, and outcomes.",
      },
    ],
  },
  faq: {
    title: "Questions businesses ask before getting started.",
    items: [
      {
        question: "What services does DMrush provide?",
        answer:
          "SEO, web design and development, ecommerce development, Google Ads, and digital marketing.",
      },
      {
        question: "Do you work with businesses outside one industry?",
        answer:
          "Yes. DMrush works with businesses across different industries. Industry-specific landing pages can be created later for campaigns when needed.",
      },
      {
        question: "Can you handle SEO and website development together?",
        answer:
          "Yes. Search strategy and development are planned together so visibility and conversion reinforce each other.",
      },
      {
        question: "Do you manage Google Ads?",
        answer:
          "Yes. We build and optimize Search campaigns with landing-page alignment and conversion tracking.",
      },
      {
        question: "Do you build ecommerce websites?",
        answer:
          "Yes. Ecommerce development is a primary DMrush service covering product experience, checkout UX, performance, and technical SEO.",
      },
      {
        question: "How do we get started?",
        answer:
          "Book a strategy call or request a free website and SEO audit through the contact page.",
      },
    ],
  },
  finalCta: {
    title: "Ready to build a stronger digital presence?",
    body: "Whether you need search visibility, a better website, ecommerce, or paid growth — start with a clear conversation.",
    primary: ctas.primary,
    secondary: ctas.secondary,
  },
} as const;
