import { getCourseById } from "@/content/courses";
import type { Course } from "@/content/course-types";
import {
  findSubmission,
  listAssignments,
  listCertificates,
  listLessonCompletions,
} from "./lms-db";
import type { PortalAssignment, PortalSubmission } from "./types";

export const DEFAULT_PASS_THRESHOLD = 50;

export function courseLessonIds(course: Course): string[] {
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
}

export function getStudentCourseProgress(studentId: string, courseId: string): {
  completed: number;
  total: number;
  percent: number;
  completedLessonIds: string[];
} {
  const course = getCourseById(courseId);
  if (!course) return { completed: 0, total: 0, percent: 0, completedLessonIds: [] };
  const ids = courseLessonIds(course);
  const done = listLessonCompletions().filter(
    (c) => c.studentId === studentId && c.courseId === courseId,
  );
  const completedLessonIds = done.map((d) => d.lessonId).filter((id) => ids.includes(id));
  const completed = completedLessonIds.length;
  const total = ids.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent, completedLessonIds };
}

export function assignmentPassThreshold(assignment: PortalAssignment, courseId: string): number {
  if (typeof assignment.passThresholdPercent === "number") return assignment.passThresholdPercent;
  const course = getCourseById(courseId);
  return course?.passThresholdPercent ?? DEFAULT_PASS_THRESHOLD;
}

export function isSubmissionPassing(
  submission: PortalSubmission | undefined,
  assignment: PortalAssignment,
): boolean {
  if (!submission || submission.status !== "reviewed") return false;
  if (typeof submission.obtainedMarks !== "number") return false;
  const threshold = assignmentPassThreshold(assignment, assignment.courseId);
  const required = (assignment.totalMarks * threshold) / 100;
  return submission.obtainedMarks >= required;
}

export type CertificateEligibility = {
  eligible: boolean;
  issued: boolean;
  lessonsComplete: boolean;
  assignmentsComplete: boolean;
  progressPercent: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  assignmentsPassed: number;
  assignmentsRequired: number;
  missingAssignmentTitles: string[];
};

export function getCertificateEligibility(
  studentId: string,
  courseId: string,
): CertificateEligibility {
  const progress = getStudentCourseProgress(studentId, courseId);
  const lessonsComplete = progress.total > 0 && progress.completed === progress.total;

  const requiredAssignments = listAssignments().filter((a) => a.courseId === courseId);
  const missingAssignmentTitles: string[] = [];
  let assignmentsPassed = 0;
  for (const a of requiredAssignments) {
    const sub = findSubmission(a.id, studentId);
    if (isSubmissionPassing(sub, a)) assignmentsPassed += 1;
    else missingAssignmentTitles.push(a.title);
  }
  const assignmentsComplete =
    requiredAssignments.length === 0 || missingAssignmentTitles.length === 0;

  const issued = listCertificates().some(
    (c) => c.studentId === studentId && c.courseId === courseId,
  );

  return {
    eligible: lessonsComplete && assignmentsComplete,
    issued,
    lessonsComplete,
    assignmentsComplete,
    progressPercent: progress.percent,
    lessonsCompleted: progress.completed,
    lessonsTotal: progress.total,
    assignmentsPassed,
    assignmentsRequired: requiredAssignments.length,
    missingAssignmentTitles,
  };
}
