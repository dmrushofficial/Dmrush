import Link from "next/link";
import { redirect } from "next/navigation";
import { courses } from "@/content/courses";
import { getPortalStudentSession } from "@/lib/portal/session-server";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "My Courses",
  description: "Enrolled courses",
  path: "/student/courses",
  noIndex: true,
});

export default async function StudentCoursesPage() {
  const student = await getPortalStudentSession();
  if (!student) redirect("/login");

  const enrolled = courses.filter((c) => student.enrolledCourseIds.includes(c.id));
  const available = courses.filter((c) => !student.enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">My courses</h1>
        <p className="mt-2 text-sm text-muted">
          Courses assigned when you were admitted in the admin panel.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Enrolled</h2>
        {enrolled.length === 0 ? (
          <p className="text-sm text-muted">No enrolled courses yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {enrolled.map((course) => (
              <Link
                key={course.id}
                href={`/student/courses/${course.slug}`}
                className="rounded-2xl border border-line bg-surface p-5 hover:border-accent/30"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {course.category}
                </p>
                <h3 className="mt-2 text-xl font-bold text-ink">{course.title}</h3>
                <p className="mt-2 text-sm text-muted">{course.shortDescription}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {available.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">Also available at DMrush Learn</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {available.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="rounded-2xl border border-line bg-cream p-5 hover:border-accent/30"
              >
                <h3 className="text-lg font-bold text-ink">{course.title}</h3>
                <p className="mt-2 text-sm text-muted">{course.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
