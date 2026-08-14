import type { Course } from "@/content/course-types";

export const globalSeoMastery: Course = {
  id: "course-global-seo",
  slug: "global-seo-mastery",
  title: "Global SEO Mastery",
  shortDescription:
    "Master organic search with technical SEO, content systems, authority, and AI-assisted workflows.",
  description:
    "A practical three-month SEO program covering keyword strategy, technical foundations, on-page and semantic SEO, measurement, audits, and client-ready reporting — built for real-world search growth.",
  headline: "Build durable organic visibility — not one-off ranking tricks.",
  valueProposition:
    "Learn how search engines evaluate pages, then practice keyword research, on-page systems, technical SEO, audits, and reporting through live classroom work and a final real-world SEO project.",
  category: "SEO",
  level: "Intermediate",
  duration: "3 Months",
  classesPerWeek: 3,
  days: "Monday / Wednesday / Saturday",
  classTime: "12:00 PM – 1:30 PM",
  classroom: "Room 1",
  trainingMode: "On-Campus",
  location: "DMRUSH, Pattoki",
  certificate: "DMRUSH Course Completion Certificate",
  metaTitle: "Global SEO Mastery Course | DMRUSH Learn Pattoki",
  metaDescription:
    "3-month Global SEO Mastery at DMRUSH Learn in Pattoki. Keyword research, technical SEO, content systems, audits, GSC, GA4, and a real-world SEO project. Mon/Wed/Sat, 12:00–1:30 PM.",
  instructor: "Instructor to be announced",
  instructorImage: null,
  thumbnail: "/images/courses/visuals/global-seo-hero.jpg",
  thumbnailTone: "forest",
  visualTheme: "global-seo",
  moduleCount: 3,
  lessonCount: 9,
  assignmentCount: 5,
  enrollmentState: "enrolled",
  progress: 42,
  certificateEligible: false,
  passThresholdPercent: 50,
  aboutWhat: "Keyword research, on-page, technical SEO, audits, GSC/GA4, and client reporting.",
  aboutWho: "Students, freelancers, and marketers who want professional organic search skills.",
  aboutPractice: "Live audits, keyword maps, and a final real-world SEO project.",
  overview:
    "Global SEO Mastery teaches how to grow organic visibility with systems that compound. You will move from search fundamentals to keyword and competitor research, on-page and semantic SEO, technical health, analytics, WordPress and ecommerce SEO patterns, link building fundamentals, audits, reporting, and AI-assisted workflows used in modern SEO work.",
  whoFor:
    "Ideal for students, graduates, freelancers, job seekers, and marketers who want to deliver SEO work for websites, clients, or their own projects — with clear methods instead of guesswork.",
  whyPractical:
    "DMRUSH training follows Learn → Practice → Build → Portfolio → Career. Every major topic includes classroom exercises, portal notes, and assignments so you can show what you can do — not only what you attended.",
  skills: [
    { icon: "🔍", title: "Keyword Research", description: "Map intent to pages that can win." },
    { icon: "🧱", title: "On-Page SEO", description: "Optimize structure, content, and internal links." },
    { icon: "⚙️", title: "Technical SEO", description: "Fix crawl, index, and performance blockers." },
    { icon: "🧠", title: "Semantic SEO", description: "Build topical authority with entity thinking." },
    { icon: "📊", title: "GSC & GA4", description: "Diagnose visibility and traffic signals." },
    { icon: "🧪", title: "SEO Audits", description: "Deliver prioritized site recommendations." },
    { icon: "🔗", title: "Link Fundamentals", description: "Plan ethical authority building." },
    { icon: "🤖", title: "AI-Assisted SEO", description: "Accelerate research with quality control." },
  ],
  learningOutcomes: [
    "Explain how search engines crawl, index, and rank pages",
    "Run keyword research mapped to search intent and page types",
    "Analyze competitors and prioritize SEO opportunities",
    "Optimize on-page elements, content structure, and internal linking",
    "Apply semantic SEO, entity thinking, and topical authority basics",
    "Audit technical SEO: crawlability, sitemaps, robots, canonicals, schema, CWV",
    "Use Google Search Console and GA4 for diagnosis and reporting",
    "Apply SEO fundamentals on WordPress and ecommerce sites",
    "Plan ethical link building and client SEO workflows",
    "Deliver an SEO audit and measurement-ready report",
    "Use AI responsibly to accelerate research and content briefs",
  ],
  curriculum: [
    {
      periodLabel: "Month 1",
      theme: "Foundation",
      modules: [
        {
          title: "SEO fundamentals & how search works",
          summary:
            "Build a clear mental model of organic search so every later tactic has a purpose.",
          topics: [
            "SEO fundamentals and the modern search landscape",
            "How search engines crawl, render, index, and rank",
            "SERP features and what they mean for strategy",
            "Organic growth vs paid acquisition roles",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Keyword research & search intent",
          summary:
            "Learn to choose keywords that match user intent and business goals — not vanity volume alone.",
          topics: [
            "Keyword research workflows",
            "Search intent mapping to page types",
            "Prioritization frameworks for limited resources",
            "Content gap and opportunity spotting",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Competitor analysis foundations",
          summary:
            "Study competing pages and domains to reverse-engineer what already wins in the SERP.",
          topics: [
            "Competitor identification and SERP analysis",
            "Content depth, structure, and authority signals",
            "Opportunity scoring for your niche",
          ],
        assignment: "Classroom practice task",
        },
      ],
    },
    {
      periodLabel: "Month 2",
      theme: "Advanced Skills",
      modules: [
        {
          title: "On-page, content & semantic SEO",
          summary:
            "Optimize pages and content systems so they rank, convert, and build topical strength.",
          topics: [
            "On-page SEO and content optimization",
            "Semantic SEO and entity SEO basics",
            "Topical authority and content clusters",
            "Internal linking systems that pass context and equity",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Technical SEO essentials",
          summary:
            "Diagnose crawl, index, and performance issues that block organic growth.",
          topics: [
            "Crawling, indexing, and site architecture",
            "XML sitemaps, robots.txt, and canonicals",
            "Schema markup fundamentals",
            "Core Web Vitals and page experience basics",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Measurement with GSC & GA4",
          summary:
            "Connect SEO work to real visibility and traffic signals.",
          topics: [
            "Google Search Console setup and diagnosis",
            "GA4 fundamentals for organic reporting",
            "Basic SEO dashboards and KPI selection",
          ],
        assignment: "Classroom practice task",
        },
      ],
    },
    {
      periodLabel: "Month 3",
      theme: "Professional Application",
      modules: [
        {
          title: "Platform SEO, links & AI workflows",
          summary:
            "Apply SEO on common platforms and accelerate work with responsible AI usage.",
          topics: [
            "WordPress SEO and ecommerce SEO patterns",
            "International SEO concepts",
            "Link building fundamentals and risk awareness",
            "AI-assisted SEO and AI search visibility basics",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Audits, reporting & client management",
          summary:
            "Package SEO work like a professional: audits, reports, and client communication.",
          topics: [
            "Full-site SEO audit process",
            "SEO reporting that stakeholders understand",
            "Client SEO management workflows",
            "Freelancing and client acquisition fundamentals",
          ],
        assignment: "Classroom practice task",
        },
        {
          title: "Capstone preparation",
          summary:
            "Combine research, technical fixes, content recommendations, and a final presentation.",
          topics: [
            "Project scoping and deliverable standards",
            "Prioritized roadmap building",
            "Final project review criteria",
          ],
        assignment: "Classroom practice task",
        },
      ],
    },
  ],
  tools: [
    "Google Search Console",
    "Google Analytics 4",
    "Google Keyword Planner / search operators",
    "Browser DevTools",
    "Screaming Frog or similar crawlers (concepts)",
    "WordPress SEO plugins (concepts)",
    "ChatGPT / Claude / Gemini for research assistance",
  ],
  buildItIntro: "Students practice real workflows in class — then package work into portfolio deliverables.",
  practicalTraining: [
    "Live keyword and intent mapping workshops",
    "Competitor SERP teardown exercises",
    "On-page and internal linking critiques",
    "Technical crawl and indexability checks",
    "GSC and GA4 walkthroughs",
    "SEO audit practice on real or demo sites",
  ],
  miniProjects: [
    "Keyword + intent map for a niche website",
    "On-page optimization brief for a target URL",
    "Technical SEO checklist audit",
    "Monthly-style SEO progress report draft",
  ],
  finalProject: {
    title: "Real-world SEO project",
    description:
      "Complete an end-to-end SEO engagement for a real or simulated website: research, technical and on-page recommendations, content priorities, measurement plan, and a client-ready roadmap.",
  },
    careerOpportunities: [
    "SEO Specialist",
    "Junior SEO Executive",
    "SEO Freelancer",
    "SEO Analyst",
    "Content SEO Specialist",
    "SEO Associate in an agency or in-house team",
  ],
    modules: [
    {
      id: "gsm-m1",
      title: "SEO foundations & search intent",
      lessons: [
        { id: "gsm-l1", title: "How search engines evaluate pages", duration: "14 min", type: "notes" },
        { id: "gsm-l2", title: "Intent mapping workshop", duration: "18 min", type: "worksheet" },
        { id: "gsm-l3", title: "Keyword prioritization framework", duration: "12 min", type: "notes" },
      ],
    },
    {
      id: "gsm-m2",
      title: "Technical SEO essentials",
      lessons: [
        { id: "gsm-l4", title: "Crawl, index, and render", duration: "16 min", type: "notes" },
        { id: "gsm-l5", title: "Site architecture checklist", duration: "10 min", type: "notes" },
        { id: "gsm-l6", title: "Technical audit practice", duration: "25 min", type: "worksheet" },
      ],
    },
    {
      id: "gsm-m3",
      title: "On-page & content systems",
      lessons: [
        { id: "gsm-l7", title: "Page briefs that rank and convert", duration: "15 min", type: "notes" },
        { id: "gsm-l8", title: "Internal linking strategy", duration: "12 min", type: "notes" },
        { id: "gsm-l9", title: "Content cluster assignment", duration: "30 min", type: "worksheet" },
      ],
    },
  ],
  relatedCourseSlugs: ["local-seo-mastery","guest-posting-link-building","ai-tools-prompt-engineering"],
  faq: [
    {
      question: "Do I need previous SEO experience?",
      answer:
        "No. We start from fundamentals and build into intermediate practice. Comfort with browsing websites and basic computer use is enough to begin.",
    },
    {
      question: "Is Global SEO different from Local SEO?",
      answer:
        "Yes. This course focuses on broader organic search systems. Local SEO Mastery covers Maps, Google Business Profile, and nearby-demand tactics in a separate program.",
    },
    {
      question: "Will we work on practical projects?",
      answer:
        "Yes. You will complete mini projects and a final real-world SEO project with research, recommendations, and reporting.",
    },
    {
      question: "Do I need my own laptop?",
      answer:
        "A personal laptop is strongly recommended for research, audits, and assignments during and after class.",
    },
    {
      question: "What tools will we use?",
      answer:
        "Core free platforms like Google Search Console and GA4, plus practical workflows for research and auditing. Specific third-party tools may vary as the market changes.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Yes. After meeting attendance and assignment requirements, you receive a DMRUSH Course Completion Certificate.",
    },
    {
      question: "Can freelancers join this course?",
      answer:
        "Absolutely. The curriculum includes client workflow, reporting, and freelancing fundamentals so you can package SEO as a service.",
    },
    {
      question: "Does this course guarantee rankings or income?",
      answer:
        "No. SEO outcomes depend on competition, implementation, and business factors. We teach professional skills — not ranking or income guarantees.",
    },
  ],
};
