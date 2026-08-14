import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireStudent } from "@/lib/portal/api-auth";
import {
  listLessonCompletions,
  markLessonComplete,
  unmarkLessonComplete,
} from "@/lib/portal/lms-db";
import { courseLessonIds, getStudentCourseProgress } from "@/lib/portal/progress";

/** GET ?courseId= — progress for enrolled course */
export async function GET(request: Request) {
  const auth = await requireStudent();
  if ("error" in auth) return auth.error;
  const courseId = new URL(request.url).searchParams.get("courseId")?.trim() || "";
  if (!courseId) {
    return NextResponse.json({ success: false, message: "courseId required." }, { status: 400 });
  }
  if (!auth.student.enrolledCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  const progress = getStudentCourseProgress(auth.student.id, courseId);
  return NextResponse.json({ success: true, progress });
}

/** POST { courseId, lessonId, complete?: boolean } */
export async function POST(request: Request) {
  const auth = await requireStudent();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => ({}));
  const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId.trim() : "";
  const complete = body.complete !== false;

  if (!courseId || !lessonId) {
    return NextResponse.json({ success: false, message: "courseId and lessonId required." }, { status: 400 });
  }
  if (!auth.student.enrolledCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  const course = getCourseById(courseId);
  if (!course || !courseLessonIds(course).includes(lessonId)) {
    return NextResponse.json({ success: false, message: "Lesson not found." }, { status: 404 });
  }

  if (complete) {
    markLessonComplete({ studentId: auth.student.id, courseId, lessonId });
  } else {
    unmarkLessonComplete(auth.student.id, courseId, lessonId);
  }

  const progress = getStudentCourseProgress(auth.student.id, courseId);
  return NextResponse.json({
    success: true,
    progress,
    completions: listLessonCompletions().filter(
      (c) => c.studentId === auth.student.id && c.courseId === courseId,
    ),
  });
}
