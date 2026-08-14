import { NextResponse } from "next/server";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import { findPortalStudentById } from "@/lib/portal/db";
import { getFileMeta, readUploadBuffer } from "@/lib/portal/storage";
import { findSubmission, getAssignment, listCourseResources } from "@/lib/portal/lms-db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const meta = getFileMeta(id);
  if (!meta) {
    return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  }

  const studentAuth = await requireStudent();
  const teacherAuth = "error" in studentAuth ? await requireTeacher() : null;

  let allowed = false;

  if (!("error" in studentAuth)) {
    if (meta.ownerId === studentAuth.student.id) allowed = true;
    if (meta.purpose === "resource" && meta.courseId) {
      if (studentAuth.student.enrolledCourseIds.includes(meta.courseId)) allowed = true;
    }
    if (meta.purpose === "submission" && meta.assignmentId) {
      const sub = findSubmission(meta.assignmentId, studentAuth.student.id);
      if (sub?.fileId === meta.id || sub?.attempts?.some((a) => a.fileId === meta.id)) {
        allowed = true;
      }
    }
  } else if (teacherAuth && !("error" in teacherAuth)) {
    if (meta.ownerId === teacherAuth.teacher.id) allowed = true;
    if (meta.courseId && teacherAuth.teacher.assignedCourseIds.includes(meta.courseId)) {
      allowed = true;
    }
    if (meta.assignmentId) {
      const assignment = getAssignment(meta.assignmentId);
      if (assignment && teacherAuth.teacher.assignedCourseIds.includes(assignment.courseId)) {
        allowed = true;
      }
    }
    // Resource on assigned course
    const resources = listCourseResources(meta.courseId);
    if (resources.some((r) => r.fileId === meta.id)) allowed = true;
  }

  // Extra: teacher viewing any submission file for assigned course
  if (!allowed && teacherAuth && !("error" in teacherAuth) && meta.purpose === "submission") {
    const student = findPortalStudentById(meta.ownerId);
    if (
      student &&
      student.enrolledCourseIds.some((c) => teacherAuth.teacher.assignedCourseIds.includes(c))
    ) {
      allowed = true;
    }
  }

  if (!allowed) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const buf = readUploadBuffer(meta.id);
  if (!buf) {
    return NextResponse.json({ success: false, message: "File missing on disk." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": meta.mimeType,
      "Content-Length": String(meta.size),
      "Content-Disposition": `attachment; filename="${meta.originalName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
