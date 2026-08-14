import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireTeacher } from "@/lib/portal/api-auth";
import { readPortalDb } from "@/lib/portal/db";

export async function GET() {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const assigned = new Set(auth.teacher.assignedCourseIds);
  const students = readPortalDb()
    .students.filter((s) => s.isActive && s.enrolledCourseIds.some((id) => assigned.has(id)))
    .map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      cohort: s.cohort,
      enrolledCourseIds: s.enrolledCourseIds.filter((id) => assigned.has(id)),
      enrolledCourses: s.enrolledCourseIds
        .filter((id) => assigned.has(id))
        .map((id) => getCourseById(id)?.title ?? id),
    }));
  return NextResponse.json({ success: true, students });
}
