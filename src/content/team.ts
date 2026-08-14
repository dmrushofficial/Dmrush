export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  expertise?: string;
  bio?: string;
  photo?: string;
};

/** Placeholder profiles until real team details are provided. */
export const team: TeamMember[] = [
  {
    slug: "ayaan-malik",
    name: "Ayaan Malik",
    role: "Founder & Growth Strategist",
    expertise: "Strategy · SEO · Growth systems",
    bio: "Leads engagement strategy across search, web, and paid channels so priorities stay connected to business outcomes.",
  },
  {
    slug: "sara-khan",
    name: "Sara Khan",
    role: "SEO Lead",
    expertise: "Technical SEO · Content systems",
    bio: "Owns keyword strategy, technical foundations, and content systems that compound organic visibility over time.",
  },
  {
    slug: "daniel-brooks",
    name: "Daniel Brooks",
    role: "Head of Web Development",
    expertise: "UX · Performance · SEO foundations",
    bio: "Designs and builds websites that turn search and ad traffic into clear next actions.",
  },
  {
    slug: "maya-patel",
    name: "Maya Patel",
    role: "Google Ads Specialist",
    expertise: "Search campaigns · Conversion tracking",
    bio: "Builds paid search systems with landing-page alignment and measurement that keep spend accountable.",
  },
  {
    slug: "omar-hassan",
    name: "Omar Hassan",
    role: "Digital Marketing Strategist",
    expertise: "Channel planning · Funnel strategy",
    bio: "Connects organic, paid, and website work into one growth plan instead of competing silos.",
  },
  {
    slug: "lena-ortiz",
    name: "Lena Ortiz",
    role: "Ecommerce Specialist",
    expertise: "Product UX · Checkout · Technical SEO",
    bio: "Improves ecommerce experiences from product discovery through checkout with performance and SEO in mind.",
  },
];
