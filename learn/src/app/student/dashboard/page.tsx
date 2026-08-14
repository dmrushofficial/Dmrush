import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Panel, StatCard } from "@/components/dashboard/DashboardBits";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { courses, getCourseById } from "@/content/courses";
import {
  findSubmission,
  listAnnouncements,
  listAssignments,
  listCertificates,
  listSubmissions,
} from "@/lib/portal/lms-db";
import { getCertificateEligibility, getStudentCourseProgress } from "@/lib/portal/progress";
import { getPortalStudentSession } from "@/lib/portal/session-server";

export default async function StudentDashboardPage() {
  const student = await getPortalStudentSession();
  if (!student) redirect("/login");

  const enrolled = courses.filter((c) => student.enrolledCourseIds.includes(c.id));
  const enrolledSet = new Set(student.enrolledCourseIds);
  const assignments = listAssignments().filter((a) => enrolledSet.has(a.courseId) && a.status === "open");
  const pending = assignments.filter((a) => {
    const sub = findSubmission(a.id, student.id);
    return !sub || sub.status === "resubmission_required";
  });
  const graded = listSubmissions().filter(
    (s) => s.studentId === student.id && s.status === "reviewed",
  );
  const announcements = listAnnouncements()
    .filter((a) => a.courseId === "all" || enrolledSet.has(a.courseId))
    .slice(0, 4);
  const certificates = listCertificates().filter((c) => c.studentId === student.id);
  const eligibleCount = enrolled.filter(
    (c) => getCertificateEligibility(student.id, c.id).eligible && !getCertificateEligibility(student.id, c.id).issued,
  ).length;

  const attRes = await (async () => {
    const { listAttendanceSessions } = await import("@/lib/portal/lms-db");
    const sessions = listAttendanceSessions();
    let present = 0;
    let absent = 0;
    let late = 0;
    for (const s of sessions) {
      if (!enrolledSet.has(s.courseId)) continue;
      const rec = s.records.find((r) => r.studentId === student.id);
      if (!rec) continue;
      if (rec.status === "present") present += 1;
      else if (rec.status === "absent") absent += 1;
      else late += 1;
    }
    const total = present + absent + late;
    return total === 0 ? 0 : Math.round(((present + late * 0.5) / total) * 100);
  })();

  return (
    <div className="space-y-6">
      <div>
        <p className="t-label text-accent">Welcome</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-ink">Hi, {student.name}</h1>
        <p className="mt-2 text-sm text-muted">
          Progress, assignments, attendance, and certificates update from live portal data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled courses" value={String(enrolled.length)} />
        <StatCard label="Needs action" value={String(pending.length)} />
        <StatCard label="Attendance" value={`${attRes}%`} />
        <StatCard
          label="Certificates"
          value={`${certificates.length}${eligibleCount ? ` · ${eligibleCount} eligible` : ""}`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="My courses"
          action={
            <Link href="/student/courses" className="text-sm font-semibold text-accent">
              All courses
            </Link>
          }
        >
          <div className="space-y-4">
            {enrolled.length === 0 ? (
              <p className="text-sm text-muted">
                No courses linked yet. Ask admin to confirm your admission email and course mapping.
              </p>
            ) : (
              enrolled.map((course) => {
                const progress = getStudentCourseProgress(student.id, course.id);
                return (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.slug}`}
                    className="flex gap-4 rounded-xl border border-line bg-cream p-3 hover:border-accent/30"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-panel">
                      <Image src={course.thumbnail} alt="" fill className="object-cover" sizes="112px" />
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <p className="font-semibold text-ink break-words">{course.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {progress.completed}/{progress.total} lessons · {progress.percent}%
                      </p>
                      <ProgressBar value={progress.percent} className="mt-2" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Upcoming assignments">
            <ul className="space-y-3">
              {assignments.slice(0, 5).map((item) => {
                const sub = findSubmission(item.id, student.id);
                return (
                  <li key={item.id}>
                    <Link
                      href={`/student/assignments/${item.id}`}
                      className="block rounded-xl border border-line bg-cream p-3 hover:border-accent/30"
                    >
                      <p className="text-sm font-semibold text-ink break-words">{item.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {getCourseById(item.courseId)?.title} · Due {item.dueDate}
                      </p>
                      <div className="mt-2">
                        <Badge>{(sub?.status || "pending").replaceAll("_", " ")}</Badge>
                      </div>
                    </Link>
                  </li>
                );
              })}
              {assignments.length === 0 ? (
                <p className="text-sm text-muted">No open assignments.</p>
              ) : null}
            </ul>
          </Panel>
          <Panel title="Announcements">
            <ul className="space-y-3">
              {announcements.map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
              {announcements.length === 0 ? (
                <p className="text-sm text-muted">No announcements yet.</p>
              ) : null}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="Recent grades">
        <ul className="space-y-3">
          {graded.slice(0, 6).map((item) => {
            const assignment = listAssignments().find((a) => a.id === item.assignmentId);
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-cream px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink break-words">
                    {assignment?.title ?? "Assignment"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {assignment ? getCourseById(assignment.courseId)?.title : ""}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-ink">
                  {item.obtainedMarks}/{assignment?.totalMarks ?? "—"}
                </p>
              </li>
            );
          })}
          {graded.length === 0 ? <p className="text-sm text-muted">No graded work yet.</p> : null}
        </ul>
      </Panel>
    </div>
  );
}
