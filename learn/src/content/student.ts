export type AssignmentStatus =
  | "upcoming"
  | "submitted"
  | "graded"
  | "resubmission_required"
  | "overdue";

export type StudentAssignment = {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  dueDate: string;
  totalMarks: number;
  obtainedMarks: number | null;
  status: AssignmentStatus;
  instructions: string;
  submissionType: Array<"written" | "file" | "url">;
  submittedText?: string;
  submittedUrl?: string;
  submittedFileName?: string;
  feedback?: string;
};

export type AttendanceRecord = {
  id: string;
  courseTitle: string;
  date: string;
  status: "present" | "absent" | "late";
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  scope: "institute" | "course";
  courseTitle?: string;
};

export type Certificate = {
  id: string;
  courseTitle: string;
  courseSlug: string;
  status: "available" | "in_progress" | "locked";
  completionDate: string | null;
  certificateId: string | null;
};

export const mockStudent = {
  id: "student-demo",
  name: "Student Demo",
  email: "student.demo@example.com",
  cohort: "Spring Cohort (Demo)",
  enrolledCourseIds: ["course-global-seo", "course-ai-website", "course-shopify"],
  overallAttendance: 92,
};

export const studentAssignments: StudentAssignment[] = [
  {
    id: "asg-1",
    title: "Keyword intent map for a service business",
    courseId: "course-global-seo",
    courseTitle: "Global SEO Mastery",
    dueDate: "2026-08-20",
    totalMarks: 100,
    obtainedMarks: null,
    status: "upcoming",
    instructions:
      "Create an intent map for 12 keywords. Group by informational, commercial, and transactional intent. Recommend a page type for each group.",
    submissionType: ["written", "file"],
  },
  {
    id: "asg-2",
    title: "Technical SEO checklist audit",
    courseId: "course-global-seo",
    courseTitle: "Global SEO Mastery",
    dueDate: "2026-08-10",
    totalMarks: 100,
    obtainedMarks: 86,
    status: "graded",
    instructions:
      "Run a foundational technical audit on a provided sample site and summarize the top 8 issues with priority.",
    submissionType: ["written", "url"],
    submittedText: "Submitted audit summary with prioritized issues and recommended fixes.",
    submittedUrl: "https://example.com/demo-audit",
    feedback: "Strong prioritization. Add clearer impact notes for crawl issues next time.",
  },
  {
    id: "asg-3",
    title: "Landing section build with AI assist",
    courseId: "course-ai-website",
    courseTitle: "AI Website Building",
    dueDate: "2026-08-18",
    totalMarks: 100,
    obtainedMarks: null,
    status: "submitted",
    instructions:
      "Produce a homepage hero + services section. Document your prompts and quality review checklist.",
    submissionType: ["written", "file", "url"],
    submittedText: "Hero and services draft attached with prompt log.",
    submittedFileName: "hero-section-draft.pdf",
    submittedUrl: "https://example.com/demo-preview",
  },
  {
    id: "asg-4",
    title: "Shopify product page rewrite",
    courseId: "course-shopify",
    courseTitle: "Shopify & E-Commerce",
    dueDate: "2026-07-28",
    totalMarks: 100,
    obtainedMarks: 94,
    status: "graded",
    instructions: "Rewrite one product page for clarity, trust, and conversion.",
    submissionType: ["written", "url"],
    submittedUrl: "https://example.com/demo-product",
    feedback: "Excellent clarity and CTA hierarchy.",
  },
];

export const studentAttendance: AttendanceRecord[] = [
  { id: "att-1", courseTitle: "Global SEO Mastery", date: "2026-08-05", status: "present" },
  { id: "att-2", courseTitle: "Global SEO Mastery", date: "2026-08-07", status: "present" },
  { id: "att-3", courseTitle: "AI Website Building", date: "2026-08-06", status: "late" },
  { id: "att-4", courseTitle: "AI Website Building", date: "2026-08-08", status: "present" },
  { id: "att-5", courseTitle: "Shopify & E-Commerce", date: "2026-07-22", status: "present" },
  { id: "att-6", courseTitle: "Global SEO Mastery", date: "2026-08-01", status: "absent" },
];

export const studentAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Week 3 live session schedule",
    body: "Demo announcement: live sessions for Global SEO Mastery will be listed here.",
    date: "2026-08-11",
    scope: "course",
    courseTitle: "Global SEO Mastery",
  },
  {
    id: "ann-2",
    title: "Assignment deadline reminder",
    body: "Demo reminder: submit upcoming assignments before the due date shown in your dashboard.",
    date: "2026-08-09",
    scope: "institute",
  },
  {
    id: "ann-3",
    title: "Resource pack updated",
    body: "Demo note: downloadable templates for AI Website Building have been updated in the course resources area.",
    date: "2026-08-07",
    scope: "course",
    courseTitle: "AI Website Building",
  },
];

export const studentCertificates: Certificate[] = [
  {
    id: "cert-1",
    courseTitle: "Shopify & E-Commerce",
    courseSlug: "shopify-ecommerce",
    status: "available",
    completionDate: "2026-07-30",
    certificateId: "DMR-LEARN-DEMO-001",
  },
  {
    id: "cert-2",
    courseTitle: "Global SEO Mastery",
    courseSlug: "global-seo-mastery",
    status: "in_progress",
    completionDate: null,
    certificateId: null,
  },
  {
    id: "cert-3",
    courseTitle: "AI Website Building",
    courseSlug: "ai-website-building",
    status: "in_progress",
    completionDate: null,
    certificateId: null,
  },
  {
    id: "cert-4",
    courseTitle: "Local SEO Mastery",
    courseSlug: "local-seo-mastery",
    status: "locked",
    completionDate: null,
    certificateId: null,
  },
];

export const courseAttendanceSummary = [
  { courseTitle: "Global SEO Mastery", percentage: 90, present: 9, absent: 1, late: 0 },
  { courseTitle: "AI Website Building", percentage: 95, present: 8, absent: 0, late: 1 },
  { courseTitle: "Shopify & E-Commerce", percentage: 100, present: 10, absent: 0, late: 0 },
];
