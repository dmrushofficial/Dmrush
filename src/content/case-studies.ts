export type CaseStudyStat = {
  label: string;
  before: string;
  after: string;
};

export type CaseStudyKeyword = {
  term: string;
  before: string;
  after: string;
};

export type CaseStudyStep = {
  title: string;
  body: string;
};

export type CaseStudyShot = {
  src: string;
  alt: string;
  caption: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  services: string[];
  href: string;
  image: string;
  imageAlt: string;
  industry: string;
  timeframe: string;
  challenge: string;
  result: string;
  stats: CaseStudyStat[];
  keywords: CaseStudyKeyword[];
  work: string[];
  process: CaseStudyStep[];
  shots: CaseStudyShot[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "local-clinic",
    title: "A local clinic that was invisible on Maps",
    summary:
      "The practice was hard to find in local search. We rebuilt the Google profile, aligned NAP, and ranked service pages for the searches that actually book appointments.",
    services: ["Local SEO", "Google Business Profile", "On-page SEO"],
    href: "/case-studies/local-clinic",
    image: "/images/case-studies/local-clinic.jpg",
    imageAlt: "Phone on a desk showing a local clinic Maps listing",
    industry: "Healthcare",
    timeframe: "5 months",
    challenge:
      "Nearby searches were going to competitors. The Business Profile was incomplete, categories were wrong, photos were outdated, and the website did not match the listing name, address, or phone. Core terms like clinic + city and service + near me were page 3 or not ranking.",
    result:
      "The clinic now appears in the local pack for core services. Organic clicks and GBP calls moved off referrals-only. Rankings for the money terms sat in the top 10 by month five.",
    stats: [
      { label: "Organic clicks / month", before: "180", after: "1,240" },
      { label: "Keywords in top 10", before: "3", after: "28" },
      { label: "GBP calls / month", before: "12", after: "64" },
      { label: "Avg. position (tracked set)", before: "32", after: "7.4" },
    ],
    keywords: [
      { term: "clinic near me", before: "Not ranking", after: "3" },
      { term: "dental clinic [city]", before: "28", after: "4" },
      { term: "teeth cleaning", before: "41", after: "6" },
      { term: "emergency dentist", before: "19", after: "2" },
      { term: "family dentist", before: "Page 4", after: "8" },
    ],
    work: [
      "Full GBP cleanup: categories, services, hours, photos, Q&A, and posting cadence",
      "NAP consistency across website, Maps, and citations",
      "Service + location pages with unique copy, FAQs, and internal links",
      "Review request system and response templates",
      "Technical fixes: title tags, local schema, crawl waste, mobile speed",
    ],
    process: [
      {
        title: "Audit the local footprint",
        body: "Mapped every listing, duplicate, and mismatch. Compared the clinic against the three competitors owning the map pack.",
      },
      {
        title: "Fix the profile and the site together",
        body: "GBP and website had to tell the same story. Categories, services, and NAP were aligned before we pushed new pages.",
      },
      {
        title: "Build pages for booking intent",
        body: "Each core service got a page built for the query, not a generic about-us rewrite.",
      },
      {
        title: "Track the terms that book",
        body: "Weekly rank + GBP insights review. We did not chase vanity volume — only queries that lead to appointments.",
      },
    ],
    shots: [
      {
        src: "/images/case-studies/result-local.jpg",
        alt: "Business Profile insights and Maps pack on real devices",
        caption: "GBP insights and map-pack visibility after the listing rebuild.",
      },
      {
        src: "/images/case-studies/result-rankings.jpg",
        alt: "Keyword ranking table before and after",
        caption: "Tracked local keywords — before vs after over five months.",
      },
    ],
  },
  {
    slug: "home-living-store",
    title: "A home & living store that needed a clearer catalog",
    summary:
      "The shop had products, but search could not understand the catalog. We rebuilt collections, product SEO, and internal links so organic traffic could actually find items.",
    services: ["Ecommerce SEO", "Technical SEO", "Content"],
    href: "/case-studies/home-living-store",
    image: "/images/case-studies/ecommerce-store.jpg",
    imageAlt: "Home and living products on a shop floor",
    industry: "Retail",
    timeframe: "6 months",
    challenge:
      "Category pages mixed unrelated items. Product titles were supplier SKUs. Duplicate descriptions were copied across variants. Google was indexing thin tag pages and missing the real collection URLs. Organic traffic was flat and almost none of it reached product pages.",
    result:
      "Indexed product and collection pages became the growth engine. Organic clicks more than quadrupled. A tracked set of category and product terms moved into the top 10.",
    stats: [
      { label: "Organic clicks / month", before: "420", after: "2,180" },
      { label: "Keywords in top 10", before: "11", after: "67" },
      { label: "Indexed product URLs", before: "86", after: "310" },
      { label: "Organic revenue share", before: "9%", after: "27%" },
    ],
    keywords: [
      { term: "ceramic dinner set", before: "34", after: "5" },
      { term: "cotton bed sheets", before: "22", after: "7" },
      { term: "home decor [city]", before: "Not ranking", after: "9" },
      { term: "kitchen storage jars", before: "48", after: "11" },
      { term: "linen table cloth", before: "Page 3", after: "6" },
    ],
    work: [
      "Collection architecture: one intent per category, no overlapping tag junk",
      "Product title and meta templates based on how people search, not SKUs",
      "Unique descriptions on money products; variants consolidated",
      "Internal links from collections → products → related items",
      "Crawl budget: noindex filters, parameter cleanup, sitemap rebuild",
      "Image compression and alt text on the catalog that actually sells",
    ],
    process: [
      {
        title: "See what Google actually indexed",
        body: "Search Console showed thin tags ranking and real products missing. That set the first 30 days of technical work.",
      },
      {
        title: "Rebuild the catalog for search",
        body: "Collections were rewritten around demand. Product pages got titles people type, not warehouse codes.",
      },
      {
        title: "Give every money page a path",
        body: "Internal links and breadcrumbs so equity stopped dying on dead tag URLs.",
      },
      {
        title: "Measure SKUs that move",
        body: "Tracked collection + product terms monthly. Scaled templates only after the first set held rankings.",
      },
    ],
    shots: [
      {
        src: "/images/case-studies/result-gsc.jpg",
        alt: "Search Console performance graph on a laptop",
        caption: "Search Console clicks and impressions over the engagement.",
      },
      {
        src: "/images/case-studies/result-rankings.jpg",
        alt: "Keyword ranking table before and after",
        caption: "Category and product terms — before vs after.",
      },
    ],
  },
  {
    slug: "home-services",
    title: "A home services company with a site that did not convert",
    summary:
      "The old website hid the offer and the phone number. We rebuilt service pages, fixed technical SEO, and ranked the queries that generate job calls.",
    services: ["Web Development", "SEO", "Conversion"],
    href: "/case-studies/home-services",
    image: "/images/case-studies/home-services.jpg",
    imageAlt: "Desktop monitor showing a home services website",
    industry: "Home services",
    timeframe: "4 months",
    challenge:
      "The site was slow, not mobile-friendly, and the homepage did not say what the company did. There were no service pages for plumbing, electrical, or AC repair. Rankings were stuck on the company name only. Forms were buried, so even the traffic they had did not enquire.",
    result:
      "Service + city pages started ranking. Organic clicks and form fills both moved. Average position on the tracked set dropped from the 40s into the top 10.",
    stats: [
      { label: "Organic clicks / month", before: "90", after: "890" },
      { label: "Keywords in top 10", before: "2", after: "24" },
      { label: "Form fills / month", before: "4", after: "31" },
      { label: "LCP (mobile)", before: "6.4s", after: "2.1s" },
    ],
    keywords: [
      { term: "plumber near me", before: "Not ranking", after: "5" },
      { term: "AC repair [city]", before: "36", after: "4" },
      { term: "electrician [city]", before: "29", after: "8" },
      { term: "water heater repair", before: "Page 4", after: "7" },
      { term: "emergency plumber", before: "44", after: "9" },
    ],
    work: [
      "New site: one screen that states the service, area, and phone number",
      "Dedicated pages for each trade + city, with FAQs and job photos",
      "Click-to-call header and a short enquiry form above the fold on mobile",
      "Technical: Core Web Vitals, indexation, service schema, XML sitemap",
      "GBP alignment so Maps and the website send the same signals",
    ],
    process: [
      {
        title: "Fix the page that gets the click",
        body: "If someone arrived from search, they still could not enquire. Conversion and SEO were rebuilt together.",
      },
      {
        title: "One page per job type",
        body: "No more single homepage for every trade. Each service got a URL Google could rank.",
      },
      {
        title: "Speed and crawl",
        body: "Mobile LCP and clean indexation so new pages could actually get seen.",
      },
      {
        title: "Watch calls and forms, not just ranks",
        body: "Weekly rank + form report. Copy was adjusted where pages ranked but did not convert.",
      },
    ],
    shots: [
      {
        src: "/images/case-studies/result-gsc.jpg",
        alt: "Search Console performance graph on a laptop",
        caption: "Organic clicks after service pages went live.",
      },
      {
        src: "/images/case-studies/result-rankings.jpg",
        alt: "Keyword ranking table before and after",
        caption: "Service keywords — before vs after four months.",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
