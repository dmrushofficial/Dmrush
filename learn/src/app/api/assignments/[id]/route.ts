import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import { findPortalStudentById } from "@/lib/portal/db";
import { sanitizePortalStudent } from "@/lib/portal/auth";
import {
  findSubmission,
  getAssignment,
  getSubmission,
  listSubmissions,
  newId,
  upsertSubmission,
} from "@/lib/portal/lms-db";
import type { PortalSubmission, PortalSubmissionAttempt } from "@/lib/portal/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;

  const studentAuth = await requireStudent();
  if (!("error" in studentAuth)) {
    const assignment = getAssignment(id);
    if (!assignment) {
      return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
    }
    if (!studentAuth.student.enrolledCourseIds.includes(assignment.courseId)) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }
    const course = getCourseById(assignment.courseId);
    const submission = findSubmission(assignment.id, studentAuth.student.id) ?? null;
    return NextResponse.json({
      success: true,
      assignment: { ...assignment, courseTitle: course?.title ?? "", courseSlug: course?.slug ?? "" },
      submission,
      status: submission?.status ?? "pending",
    });
  }

  const teacherAuth = await requireTeacher();
  if ("error" in teacherAuth) return teacherAuth.error;
  const assignment = getAssignment(id);
  if (!assignment) {
    return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  }
  if (!teacherAuth.teacher.assignedCourseIds.includes(assignment.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  const course = getCourseById(assignment.courseId);
  const submissions = listSubmissions()
    .filter((s) => s.assignmentId === id)
    .map((s) => {
      const student = findPortalStudentById(s.studentId);
      return {
        ...s,
        studentName: student?.name ?? s.studentId,
        studentEmail: student?.email ?? "",
      };
    });
  return NextResponse.json({
    success: true,
    assignment: { ...assignment, courseTitle: course?.title ?? "" },
    submissions,
  });
}

/** Student submit / resubmit */
export async function POST(request: Request, context: Ctx) {
  const auth = await requireStudent();
  if ("error" in auth) return auth.error;
  const { id } = await context.params;
  const assignment = getAssignment(id);
  if (!assignment || assignment.status !== "open") {
    return NextResponse.json({ success: false, message: "Assignment not available." }, { status: 404 });
  }
  if (!auth.student.enrolledCourseIds.includes(assignment.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") || "";
  let writtenText = "";
  let url = "";
  let fileId: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    writtenText = String(form.get("writtenText") || "").trim();
    url = String(form.get("url") || "").trim();
    const file = form.get("file");
    if (file && typeof file !== "string" && file.size > 0) {
      const { saveUpload } = await import("@/lib/portal/storage");
      const buf = Buffer.from(await file.arrayBuffer());
      const meta = await saveUpload({
        buffer: buf,
        originalName: file.name || "submission.bin",
        mimeType: file.type || "application/octet-stream",
        ownerId: auth.student.id,
        ownerRole: "student",
        purpose: "submission",
        courseId: assignment.courseId,
        assignmentId: assignment.id,
      });
      fileId = meta.id;
    }
  } else {
    const body = await request.json().catch(() => ({}));
    writtenText = typeof body.writtenText === "string" ? body.writtenText.trim() : "";
    url = typeof body.url === "string" ? body.url.trim() : "";
    fileId = typeof body.fileId === "string" ? body.fileId : undefined;
  }

  if (!writtenText && !url && !fileId) {
    return NextResponse.json(
      { success: false, message: "Provide a written answer, URL, and/or file." },
      { status: 400 },
    );
  }

  const existing = findSubmission(assignment.id, auth.student.id);
  if (existing?.status === "reviewed") {
    return NextResponse.json(
      {
        success: false,
        message: "Already reviewed — ask your teacher to request a resubmission.",
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const attemptNumber = (existing?.attempts?.length || 0) + 1;
  const attempt: PortalSubmissionAttempt = {
    id: newId("ATT"),
    attemptNumber,
    writtenText: writtenText || undefined,
    url: url || undefined,
    fileId,
    submittedAt: now,
    status: "submitted",
  };

  const attempts = [...(existing?.attempts || []), attempt];
  const submission: PortalSubmission = {
    id: existing?.id ?? newId("SUB"),
    assignmentId: assignment.id,
    studentId: auth.student.id,
    status: "submitted",
    writtenText: writtenText || undefined,
    url: url || undefined,
    fileId,
    obtainedMarks: undefined,
    feedback: undefined,
    gradedByTeacherId: undefined,
    submittedAt: now,
    gradedAt: undefined,
    attempts,
  };

  upsertSubmission(submission);
  return NextResponse.json({ success: true, submission });
}

/**
 * Teacher review:
 * body.action = "review" | "resubmission_required"
 * body.submissionId, obtainedMarks?, feedback?
 */
export async function PUT(request: Request, context: Ctx) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const submissionId = typeof body.submissionId === "string" ? body.submissionId : id;
  const submission = getSubmission(submissionId);
  if (!submission) {
    return NextResponse.json({ success: false, message: "Submission not found." }, { status: 404 });
  }
  const assignment = getAssignment(submission.assignmentId);
  if (!assignment || !auth.teacher.assignedCourseIds.includes(assignment.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const action =
    body.action === "resubmission_required" ? "resubmission_required" : "review";
  const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
  const now = new Date().toISOString();

  const attempts = [...(submission.attempts || [])];
  const latestIdx = attempts.length - 1;
  if (latestIdx < 0) {
    return NextResponse.json({ success: false, message: "No attempts to review." }, { status: 400 });
  }

  if (action === "resubmission_required") {
    attempts[latestIdx] = {
      ...attempts[latestIdx],
      status: "resubmission_required",
      feedback,
      gradedByTeacherId: auth.teacher.id,
      gradedAt: now,
      obtainedMarks:
        typeof body.obtainedMarks === "number" ? body.obtainedMarks : attempts[latestIdx].obtainedMarks,
    };
    const updated = upsertSubmission({
      ...submission,
      status: "resubmission_required",
      feedback,
      gradedByTeacherId: auth.teacher.id,
      gradedAt: now,
      obtainedMarks: attempts[latestIdx].obtainedMarks,
      attempts,
    });
    const student = findPortalStudentById(updated.studentId);
    return NextResponse.json({
      success: true,
      submission: {
        ...updated,
        studentName: student ? sanitizePortalStudent(student).name : updated.studentId,
      },
    });
  }

  const obtainedMarks = Number(body.obtainedMarks);
  if (!Number.isFinite(obtainedMarks) || obtainedMarks < 0 || obtainedMarks > assignment.totalMarks) {
    return NextResponse.json(
      { success: false, message: `Marks must be 0–${assignment.totalMarks}.` },
      { status: 400 },
    );
  }

  attempts[latestIdx] = {
    ...attempts[latestIdx],
    status: "reviewed",
    obtainedMarks,
    feedback,
    gradedByTeacherId: auth.teacher.id,
    gradedAt: now,
  };

  const updated = upsertSubmission({
    ...submission,
    status: "reviewed",
    obtainedMarks,
    feedback,
    gradedByTeacherId: auth.teacher.id,
    gradedAt: now,
    attempts,
  });

  const student = findPortalStudentById(updated.studentId);
  return NextResponse.json({
    success: true,
    submission: {
      ...updated,
      studentName: student ? sanitizePortalStudent(student).name : updated.studentId,
    },
  });
}
