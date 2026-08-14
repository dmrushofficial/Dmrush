import type { Course } from "@/content/course-types";
import { globalSeoMastery } from "@/content/course-pages/global-seo-mastery";
import { localSeoMastery } from "@/content/course-pages/local-seo-mastery";
import { aiWebsiteBuilding } from "@/content/course-pages/ai-website-building";
import { aiToolsPromptEngineering } from "@/content/course-pages/ai-tools-prompt-engineering";
import { guestPostingLinkBuilding } from "@/content/course-pages/guest-posting-link-building";
import { shopifyEcommerce } from "@/content/course-pages/shopify-ecommerce";

export type {
  Course,
  CourseSkill,
  CourseLevel,
  CourseLesson,
  CourseModule,
  CurriculumModule,
  CurriculumPeriod,
  EnrollmentState,
} from "@/content/course-types";

export { toolsDisclaimer } from "@/content/course-types";

export const courses: Course[] = [
  globalSeoMastery,
  localSeoMastery,
  aiWebsiteBuilding,
  aiToolsPromptEngineering,
  guestPostingLinkBuilding,
  shopifyEcommerce,
];

function scheduleLine(course: Pick<Course, "classesPerWeek" | "days" | "classTime">) {
  return `${course.classesPerWeek} classes/week · ${course.days} · ${course.classTime}`;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getRelatedCourses(course: Course): Course[] {
  return course.relatedCourseSlugs
    .map((slug) => getCourseBySlug(slug))
    .filter((item): item is Course => Boolean(item));
}

export function formatCourseSchedule(course: Course): string {
  return scheduleLine(course);
}

export const skillStrip = [
  "SEO",
  "Local SEO",
  "AI Websites",
  "AI Tools",
  "Guest Posting",
  "E-commerce",
] as const;
