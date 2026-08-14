import { NextResponse } from "next/server";
import { courses, getCourseById } from "@/content/courses";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import {
  deleteAssignment,
  getAssignment,
  listAssignments,
  listSubmissions,
  newId,
  upsertAssignment,
} from "@/lib/portal/lms-db";

function withCourse(assignment: ReturnType<typeof listAssignments>[number]) {
  const course = getCourseById(assignment.courseId);
  return {
    ...assignment,
    courseTitle: course?.title ?? assignment.courseId,
    courseSlug: course?.slug ?? "",
  };
}

export async function GET() {
  const studentAuth = await requireStudent();
  if (!("error" in studentAuth)) {
    const { student } = studentAuth;
    const enrolled = new Set(student.enrolledCourseIds);
    const assignments = listAssignments()
      .filter((a) => enrolled.has(a.courseId) && a.status === "open")
      .map(withCourse);
    const mine = listSubmissions().filter((s) => s.studentId === student.id);
    const byAssignment = new Map(mine.map((s) => [s.assignmentId, s]));
    return NextResponse.json({
      success: true,
      assignments: assignments.map((a) => ({
        ...a,
        submission: byAssignment.get(a.id) ?? null,
      })),
    });
  }

  const teacherAuth = await requireTeacher();
  if ("error" in teacherAuth) return teacherAuth.error;
  const { teacher } = teacherAuth;
  const assigned = new Set(teacher.assignedCourseIds);
  const assignments = listAssignments()
    .filter((a) => assigned.has(a.courseId))
    .map(withCourse);
  const submissions = listSubmissions();
  return NextResponse.json({
    success: true,
    assignments: assignments.map((a) => ({
      ...a,
      submissionCount: submissions.filter((s) => s.assignmentId === a.id).length,
      pendingCount: submissions.filter(
        (s) => s.assignmentId === a.id && s.status === "submitted",
      ).length,
    })),
    courses: courses.filter((c) => assigned.has(c.id)).map((c) => ({ id: c.id, title: c.title })),
  });
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const { teacher } = auth;
  const body = await request.json().catch(() => ({}));
  const courseId = typeof body.courseId === "string" ? body.courseId : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const instructions = typeof body.instructions === "string" ? body.instructions.trim() : "";
  const dueDate = typeof body.dueDate === "string" ? body.dueDate : "";
  const totalMarks = Number(body.totalMarks) || 100;

  if (!courseId || !title || !instructions || !dueDate) {
    return NextResponse.json(
      { success: false, message: "courseId, title, instructions, and dueDate are required." },
      { status: 400 },
    );
  }
  if (!teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Course not assigned to you." }, { status: 403 });
  }

  const now = new Date().toISOString();
  const assignment = upsertAssignment({
    id: newId("ASG"),
    courseId,
    title,
    instructions,
    dueDate,
    totalMarks,
    submissionTypes: Array.isArray(body.submissionTypes)
      ? body.submissionTypes
      : ["written", "url", "file"],
    createdByTeacherId: teacher.id,
    status: "open",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true, assignment: withCourse(assignment) });
}

export async function PUT(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const existing = getAssignment(id);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Assignment not found." }, { status: 404 });
  }
  if (existing.createdByTeacherId !== auth.teacher.id && !auth.teacher.assignedCourseIds.includes(existing.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const updated = upsertAssignment({
    ...existing,
    title: typeof body.title === "string" ? body.title.trim() : existing.title,
    instructions:
      typeof body.instructions === "string" ? body.instructions.trim() : existing.instructions,
    dueDate: typeof body.dueDate === "string" ? body.dueDate : existing.dueDate,
    totalMarks: Number(body.totalMarks) || existing.totalMarks,
    status: body.status === "closed" ? "closed" : body.status === "open" ? "open" : existing.status,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, assignment: withCourse(updated) });
}

export async function DELETE(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  const existing = getAssignment(id);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  }
  if (!auth.teacher.assignedCourseIds.includes(existing.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  deleteAssignment(id);
  return NextResponse.json({ success: true });
}
