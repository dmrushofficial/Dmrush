import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Course } from "@/content/courses";

export function RelatedCourses({ courses }: { courses: Course[] }) {
  if (!courses.length) return null;

  return (
    <section className="bg-cream py-12 md:py-14">
      <Container>
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink">Continue your learning</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.slug}`}
                className="block h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {course.duration}
                </p>
                <h3 className="mt-2 text-base font-bold text-ink">{course.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted line-clamp-2">
                  {course.shortDescription}
                </p>
                <p className="mt-4 text-sm font-semibold text-accent">View Course →</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
