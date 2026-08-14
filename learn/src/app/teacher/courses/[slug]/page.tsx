import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { TeacherResourcesClient } from "@/components/teacher/TeacherResourcesClient";
import { courses, getCourseBySlug } from "@/content/courses";
import { listAssignments, listSubmissions } from "@/lib/portal/lms-db";
import { readPortalDb } from "@/lib/portal/db";
import { getPortalTeacherSession } from "@/lib/portal/session-server";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function TeacherCoursePage({ params }: Props) {
  const teacher = await getPortalTeacherSession();
  if (!teacher) redirect("/login");
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !teacher.assignedCourseIds.includes(course.id)) notFound();

  const assignments = listAssignments().filter((a) => a.courseId === course.id);
  const students = readPortalDb().students.filter(
    (s) => s.isActive && s.enrolledCourseIds.includes(course.id),
  );

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="accent">{course.category}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink break-words">
          {course.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {course.days} · {course.classTime} · {students.length} enrolled students
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5 overflow-x-auto">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Assignments</h2>
            <Link href="/teacher/assignments" className="text-sm font-semibold text-accent">
              Manage →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {assignments.map((a) => {
              const pending = listSubmissions().filter(
                (s) => s.assignmentId === a.id && s.status === "submitted",
              ).length;
              return (
                <li key={a.id}>
                  <Link
                    href={`/teacher/assignments/${a.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-line bg-cream px-4 py-3 text-sm"
                  >
                    <span className="font-semibold break-words">{a.title}</span>
                    <Badge tone={pending ? "warning" : "neutral"}>{pending} pending</Badge>
                  </Link>
                </li>
              );
            })}
            {assignments.length === 0 ? (
              <p className="text-sm text-muted">No assignments for this course yet.</p>
            ) : null}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5 overflow-x-auto">
          <h2 className="text-lg font-bold">Enrolled students</h2>
          <ul className="mt-4 space-y-2">
            {students.map((s) => (
              <li key={s.id} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted break-all">{s.email}</p>
              </li>
            ))}
            {students.length === 0 ? (
              <p className="text-sm text-muted">No students enrolled yet.</p>
            ) : null}
          </ul>
        </section>
      </div>

      <TeacherResourcesClient courseId={course.id} />
    </div>
  );
}
