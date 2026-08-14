import { NextResponse } from "next/server";
import { getCourseById } from "@/content/courses";
import { requireStudent, requireTeacher } from "@/lib/portal/api-auth";
import { readPortalDb } from "@/lib/portal/db";
import {
  listAttendanceSessions,
  newId,
  upsertAttendanceSession,
} from "@/lib/portal/lms-db";
import type { AttendanceStatus, PortalAttendanceSession } from "@/lib/portal/types";

function summarizeStudent(studentId: string, courseId?: string) {
  const sessions = listAttendanceSessions().filter((s) =>
    courseId ? s.courseId === courseId : true,
  );
  let present = 0;
  let absent = 0;
  let late = 0;
  const history: Array<{
    sessionId: string;
    courseId: string;
    courseTitle: string;
    date: string;
    label?: string;
    status: AttendanceStatus;
  }> = [];

  for (const s of sessions) {
    const rec = s.records.find((r) => r.studentId === studentId);
    if (!rec) continue;
    if (rec.status === "present") present += 1;
    else if (rec.status === "absent") absent += 1;
    else late += 1;
    history.push({
      sessionId: s.id,
      courseId: s.courseId,
      courseTitle: getCourseById(s.courseId)?.title ?? s.courseId,
      date: s.date,
      label: s.label,
      status: rec.status,
    });
  }

  const total = present + absent + late;
  const percent = total === 0 ? 0 : Math.round(((present + late * 0.5) / total) * 100);
  history.sort((a, b) => b.date.localeCompare(a.date));
  return { present, absent, late, total, percent, history };
}

export async function GET(request: Request) {
  const courseId = new URL(request.url).searchParams.get("courseId")?.trim() || undefined;

  const studentAuth = await requireStudent();
  if (!("error" in studentAuth)) {
    if (courseId && !studentAuth.student.enrolledCourseIds.includes(courseId)) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }
    const enrolled = courseId
      ? [courseId]
      : studentAuth.student.enrolledCourseIds;
    const byCourse = enrolled.map((id) => ({
      courseId: id,
      courseTitle: getCourseById(id)?.title ?? id,
      ...summarizeStudent(studentAuth.student.id, id),
    }));
    return NextResponse.json({
      success: true,
      overall: summarizeStudent(studentAuth.student.id),
      byCourse,
    });
  }

  const teacherAuth = await requireTeacher();
  if ("error" in teacherAuth) return teacherAuth.error;
  if (!courseId) {
    return NextResponse.json({ success: false, message: "courseId required." }, { status: 400 });
  }
  if (!teacherAuth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const sessions = listAttendanceSessions()
    .filter((s) => s.courseId === courseId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const students = readPortalDb().students.filter(
    (s) => s.isActive && s.enrolledCourseIds.includes(courseId),
  );

  return NextResponse.json({
    success: true,
    courseId,
    courseTitle: getCourseById(courseId)?.title ?? courseId,
    sessions,
    students: students.map((s) => ({ id: s.id, name: s.name, email: s.email })),
  });
}

/** Teacher save session */
export async function POST(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => ({}));
  const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const label = typeof body.label === "string" ? body.label.trim() : undefined;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!courseId || !date) {
    return NextResponse.json({ success: false, message: "courseId and date required." }, { status: 400 });
  }
  if (!auth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }

  const recordsRaw = Array.isArray(body.records) ? body.records : [];
  const enrolled = new Set(
    readPortalDb()
      .students.filter((s) => s.isActive && s.enrolledCourseIds.includes(courseId))
      .map((s) => s.id),
  );

  const records: PortalAttendanceSession["records"] = [];
  for (const r of recordsRaw) {
    const studentId = typeof r.studentId === "string" ? r.studentId : "";
    const status = r.status as AttendanceStatus;
    if (!enrolled.has(studentId)) continue;
    if (status !== "present" && status !== "absent" && status !== "late") continue;
    records.push({ studentId, status });
  }

  const existing = listAttendanceSessions().find(
    (s) => (sessionId && s.id === sessionId) || (s.courseId === courseId && s.date === date),
  );
  const now = new Date().toISOString();
  const session: PortalAttendanceSession = {
    id: existing?.id || newId("ATTN"),
    courseId,
    date,
    label,
    markedByTeacherId: auth.teacher.id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    records,
  };
  upsertAttendanceSession(session);
  return NextResponse.json({ success: true, session });
}
