import { notFound, redirect } from "next/navigation";
import { courses, getCourseBySlug } from "@/content/courses";
import { listAssignments, findSubmission, listCourseResources } from "@/lib/portal/lms-db";
import { getStudentCourseProgress } from "@/lib/portal/progress";
import { getPortalStudentSession } from "@/lib/portal/session-server";
import { StudentCourseWorkspace } from "@/components/student/StudentCourseWorkspace";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function StudentCoursePage({ params }: Props) {
  const student = await getPortalStudentSession();
  if (!student) redirect("/login");

  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  if (!student.enrolledCourseIds.includes(course.id)) {
    redirect("/student/courses");
  }

  const progress = getStudentCourseProgress(student.id, course.id);
  const courseAssignments = listAssignments().filter(
    (item) => item.courseId === course.id && item.status === "open",
  );
  const resources = listCourseResources(course.id);

  return (
    <div className="space-y-6">
      <StudentCourseWorkspace
        courseId={course.id}
        courseTitle={course.title}
        modules={course.modules}
        initialCompletedIds={progress.completedLessonIds}
        initialPercent={progress.percent}
        resources={resources}
      />

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-ink">Assignments</h3>
          <Link href="/student/assignments" className="text-sm font-semibold text-accent">
            All assignments →
          </Link>
        </div>
        <ul className="mt-4 space-y-2">
          {courseAssignments.map((a) => {
            const sub = findSubmission(a.id, student.id);
            return (
              <li key={a.id}>
                <Link
                  href={`/student/assignments/${a.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-cream px-4 py-3"
                >
                  <span className="text-sm font-semibold text-ink">{a.title}</span>
                  <Badge>{(sub?.status || "pending").replaceAll("_", " ")}</Badge>
                </Link>
              </li>
            );
          })}
          {courseAssignments.length === 0 ? (
            <p className="text-sm text-muted">No open assignments for this course.</p>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
