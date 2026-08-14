import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import { findPortalStudentById } from "@/lib/portal/db";
import {
  listCertificates,
  newCertificateCode,
  newId,
  upsertCertificate,
} from "@/lib/portal/lms-db";
import { getCertificateEligibility } from "@/lib/portal/progress";

export async function GET(request: Request) {
  const courseId = new URL(request.url).searchParams.get("courseId")?.trim();

  const studentAuth = await requireStudent();
  if (!("error" in studentAuth)) {
    const enrolled = courseId
      ? studentAuth.student.enrolledCourseIds.filter((id) => id === courseId)
      : studentAuth.student.enrolledCourseIds;

    const items = enrolled.map((id) => {
      const eligibility = getCertificateEligibility(studentAuth.student.id, id);
      const issued = listCertificates().find(
        (c) => c.studentId === studentAuth.student.id && c.courseId === id,
      );
      const state = issued ? "issued" : eligibility.eligible ? "eligible" : "locked";
      return {
        courseId: id,
        courseTitle: getCourseById(id)?.title ?? id,
        state,
        eligibility,
        certificate: issued
          ? {
              ...issued,
              courseTitle: getCourseById(id)?.title ?? id,
            }
          : null,
      };
    });
    return NextResponse.json({ success: true, items });
  }

  const teacherAuth = await requireTeacher();
  if ("error" in teacherAuth) return teacherAuth.error;
  const items = listCertificates().map((c) => {
    const student = findPortalStudentById(c.studentId);
    return {
      ...c,
      studentName: student?.name ?? c.studentId,
      courseTitle: getCourseById(c.courseId)?.title ?? c.courseId,
    };
  });
  return NextResponse.json({ success: true, certificates: items });
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => ({}));
  const studentId = typeof body.studentId === "string" ? body.studentId : "";
  const courseId = typeof body.courseId === "string" ? body.courseId : "";
  const force = body.force === true;
  const student = findPortalStudentById(studentId);
  if (!student) {
    return NextResponse.json({ success: false, message: "Student not found." }, { status: 404 });
  }
  if (!auth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden course." }, { status: 403 });
  }
  if (!student.enrolledCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Student not enrolled in this course." }, { status: 400 });
  }

  const eligibility = getCertificateEligibility(studentId, courseId);
  if (!eligibility.eligible && !force) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Student is not eligible yet. Complete all lessons and pass all course assignments first.",
        eligibility,
      },
      { status: 400 },
    );
  }

  const course = getCourseById(courseId);
  const existing = listCertificates().find(
    (c) => c.studentId === studentId && c.courseId === courseId,
  );
  const cert = upsertCertificate({
    id: existing?.id || newId("CERT"),
    certificateCode: existing?.certificateCode || newCertificateCode(),
    studentId,
    courseId,
    title: `${course?.title ?? "Course"} Completion Certificate`,
    issuedAt: existing?.issuedAt || new Date().toISOString(),
    issuedByTeacherId: auth.teacher.id,
  });

  return NextResponse.json({
    success: true,
    certificate: {
      ...cert,
      studentName: student.name,
      courseTitle: course?.title ?? courseId,
    },
  });
}
