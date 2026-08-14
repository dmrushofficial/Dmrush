import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import {
  deleteAnnouncement,
  listAnnouncements,
  newId,
  upsertAnnouncement,
} from "@/lib/portal/lms-db";

export async function GET() {
  const studentAuth = await requireStudent();
  if (!("error" in studentAuth)) {
    const enrolled = new Set(studentAuth.student.enrolledCourseIds);
    const items = listAnnouncements()
      .filter((a) => a.courseId === "all" || enrolled.has(a.courseId))
      .map((a) => ({
        ...a,
        courseTitle: a.courseId === "all" ? "All courses" : getCourseById(a.courseId)?.title ?? a.courseId,
      }));
    return NextResponse.json({ success: true, announcements: items });
  }

  const teacherAuth = await requireTeacher();
  if ("error" in teacherAuth) return teacherAuth.error;
  const items = listAnnouncements().map((a) => ({
    ...a,
    courseTitle: a.courseId === "all" ? "All courses" : getCourseById(a.courseId)?.title ?? a.courseId,
  }));
  return NextResponse.json({ success: true, announcements: items });
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const bodyText = typeof body.body === "string" ? body.body.trim() : "";
  const courseId = typeof body.courseId === "string" ? body.courseId : "all";

  if (!title || !bodyText) {
    return NextResponse.json({ success: false, message: "Title and body required." }, { status: 400 });
  }
  if (courseId !== "all" && !auth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden course." }, { status: 403 });
  }

  const item = upsertAnnouncement({
    id: newId("ANN"),
    title,
    body: bodyText,
    courseId,
    createdByTeacherId: auth.teacher.id,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, announcement: item });
}

export async function DELETE(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const id = new URL(request.url).searchParams.get("id") || "";
  deleteAnnouncement(id);
  return NextResponse.json({ success: true });
}
