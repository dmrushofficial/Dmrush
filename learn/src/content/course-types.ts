export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type EnrollmentState = "available" | "enrolled" | "completed";

export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
  type: "notes" | "worksheet";
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type CurriculumModule = {
  title: string;
  summary: string;
  topics: string[];
  assignment?: string;
};

export type CurriculumPeriod = {
  periodLabel: string;
  theme: string;
  modules: CurriculumModule[];
};

export type CourseSkill = {
  title: string;
  description: string;
  icon: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  headline: string;
  valueProposition: string;
  category: string;
  level: CourseLevel;
  duration: string;
  classesPerWeek: number;
  days: string;
  classTime: string;
  classroom: string;
  trainingMode: string;
  location: string;
  certificate: string;
  metaTitle: string;
  metaDescription: string;
  instructor: string;
  instructorImage: string | null;
  thumbnail: string;
  thumbnailTone: "forest" | "lime" | "ink" | "sage" | "slate" | "olive";
  visualTheme:
    | "local-seo"
    | "global-seo"
    | "ai-tools"
    | "saas-ai"
    | "ai-website"
    | "wordpress"
    | "shopify"
    | "digital-marketing";
  moduleCount: number;
  lessonCount: number;
  assignmentCount: number;
  enrollmentState: EnrollmentState;
  /** Marketing-only leftover; portal progress is computed from lesson completions */
  progress: number;
  certificateEligible: boolean;
  /** Percent of totalMarks required to pass an assignment (default 50) */
  passThresholdPercent?: number;
  aboutWhat: string;
  aboutWho: string;
  aboutPractice: string;
  skills: CourseSkill[];
  /** Kept for schema / legacy; prefer skills on public pages */
  learningOutcomes: string[];
  overview: string;
  whoFor: string;
  whyPractical: string;
  curriculum: CurriculumPeriod[];
  tools: string[];
  buildItIntro: string;
  practicalTraining: string[];
  miniProjects: string[];
  finalProject: { title: string; description: string; bullets?: string[] };
  careerOpportunities: string[];
  relatedCourseSlugs: string[];
  modules: CourseModule[];
  faq: Array<{ question: string; answer: string }>;
};

export const toolsDisclaimer =
  "Tools may evolve as industry platforms change. We teach workflows and tool-selection — subscriptions are not promised unless stated.";
