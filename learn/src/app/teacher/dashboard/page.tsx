import Link from "next/link";
import { redirect } from "next/navigation";
import { Panel, StatCard } from "@/components/dashboard/DashboardBits";
import { courses } from "@/content/courses";
import {
  listAnnouncements,
  listAssignments,
  listAttendanceSessions,
  listSubmissions,
} from "@/lib/portal/lms-db";
import { readPortalDb } from "@/lib/portal/db";
import { getPortalTeacherSession } from "@/lib/portal/session-server";

export default async function TeacherDashboardPage() {
  const teacher = await getPortalTeacherSession();
  if (!teacher) redirect("/login");

  const assigned = new Set(teacher.assignedCourseIds);
  const myCourses = courses.filter((c) => assigned.has(c.id));
  const assignments = listAssignments().filter((a) => assigned.has(a.courseId));
  const pending = listSubmissions().filter((s) => {
    const a = assignments.find((x) => x.id === s.assignmentId);
    return a && s.status === "submitted";
  });
  const resubmissions = listSubmissions().filter((s) => {
    const a = assignments.find((x) => x.id === s.assignmentId);
    return a && s.status === "resubmission_required";
  });
  const students = readPortalDb().students.filter(
    (s) => s.isActive && s.enrolledCourseIds.some((id) => assigned.has(id)),
  );
  const announcements = listAnnouncements()
    .filter((a) => a.courseId === "all" || assigned.has(a.courseId))
    .slice(0, 4);
  const attendanceSessions = listAttendanceSessions().filter((s) => assigned.has(s.courseId));

  return (
    <div className="space-y-6">
      <div>
        <p className="t-label text-accent">Teacher portal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-ink">
          Welcome, {teacher.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Assignments, attendance, announcements, and certificates share live portal data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Assigned courses" value={String(myCourses.length)} />
        <StatCard label="Students" value={String(students.length)} />
        <StatCard label="Pending reviews" value={String(pending.length)} />
        <StatCard label="Resubmissions open" value={String(resubmissions.length)} />
        <StatCard label="Attendance sessions" value={String(attendanceSessions.length)} />
        <StatCard label="Announcements" value={String(announcements.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Quick actions"
          action={
            <Link href="/teacher/assignments" className="text-sm font-semibold text-accent">
              Assignments
            </Link>
          }
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href="/teacher/assignments"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-ink"
            >
              Create / review assignments
            </Link>
            <Link
              href="/teacher/attendance"
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold"
            >
              Mark attendance
            </Link>
            <Link
              href="/teacher/announcements"
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold"
            >
              Post announcement
            </Link>
            <Link
              href="/teacher/students"
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold"
            >
              Students & certificates
            </Link>
          </div>
        </Panel>
        <Panel title="Recent announcements">
          <ul className="space-y-2">
            {announcements.map((a) => (
              <li key={a.id} className="text-sm">
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="text-xs text-muted">{new Date(a.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
            {announcements.length === 0 ? (
              <p className="text-sm text-muted">No announcements yet.</p>
            ) : null}
          </ul>
        </Panel>
      </div>

      <Panel title="Your courses">
        <ul className="grid gap-3 md:grid-cols-2">
          {myCourses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/teacher/courses/${c.slug}`}
                className="block rounded-xl border border-line bg-cream p-4 hover:border-accent/30"
              >
                <p className="font-semibold text-ink break-words">{c.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {c.days} · {c.classTime}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
