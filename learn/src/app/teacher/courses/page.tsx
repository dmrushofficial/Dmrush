import Link from "next/link";
import { redirect } from "next/navigation";
import { courses } from "@/content/courses";
import { getPortalTeacherSession } from "@/lib/portal/session-server";

export default async function TeacherCoursesPage() {
  const teacher = await getPortalTeacherSession();
  if (!teacher) redirect("/login");
  const assigned = new Set(teacher.assignedCourseIds);
  const myCourses = courses.filter((c) => assigned.has(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">My courses</h1>
        <p className="mt-2 text-sm text-muted">Courses assigned to your instructor account.</p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {myCourses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/teacher/courses/${course.slug}`}
              className="block rounded-2xl border border-line bg-surface p-5 hover:border-accent/30"
            >
              <h2 className="text-lg font-bold text-ink">{course.title}</h2>
              <p className="mt-2 text-sm text-muted">{course.shortDescription}</p>
              <p className="mt-3 text-xs text-muted">
                {course.duration} · {course.days} · {course.classTime}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
