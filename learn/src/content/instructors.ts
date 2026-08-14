export type InstructorPlaceholder = {
  id: string;
  name: string;
  role: string;
  courseTaught: string;
  expertise: string;
  photo: string | null;
};

/** Placeholder cards until real instructors are provided. */
export const instructors: InstructorPlaceholder[] = [
  {
    id: "inst-1",
    name: "Instructor to be announced",
    role: "SEO Instructor",
    courseTaught: "Global SEO Mastery",
    expertise: "Technical SEO · Content systems",
    photo: null,
  },
  {
    id: "inst-2",
    name: "Instructor to be announced",
    role: "Local SEO Instructor",
    courseTaught: "Local SEO Mastery",
    expertise: "Maps · GBP · Local pages",
    photo: null,
  },
  {
    id: "inst-3",
    name: "Instructor to be announced",
    role: "Ecommerce Instructor",
    courseTaught: "Shopify & E-Commerce",
    expertise: "Shopify · Conversion · Store SEO",
    photo: null,
  },
  {
    id: "inst-4",
    name: "Instructor to be announced",
    role: "WordPress Instructor",
    courseTaught: "WordPress Website Development",
    expertise: "WordPress · Themes · Site SEO",
    photo: null,
  },
  {
    id: "inst-5",
    name: "Instructor to be announced",
    role: "AI Tools Instructor",
    courseTaught: "AI Tools & Prompt Engineering",
    expertise: "Prompt systems · AI tooling",
    photo: null,
  },
  {
    id: "inst-6",
    name: "Instructor to be announced",
    role: "SaaS AI Instructor",
    courseTaught: "SaaS-Based AI Tools",
    expertise: "SaaS AI · Automation · Workflows",
    photo: null,
  },
  {
    id: "inst-7",
    name: "Instructor to be announced",
    role: "Digital Marketing Instructor",
    courseTaught: "Digital Marketing",
    expertise: "Channels · Content · Paid growth",
    photo: null,
  },
  {
    id: "inst-8",
    name: "Instructor to be announced",
    role: "AI & Web Instructor",
    courseTaught: "AI Website Building",
    expertise: "AI workflows · Web building",
    photo: null,
  },
];
