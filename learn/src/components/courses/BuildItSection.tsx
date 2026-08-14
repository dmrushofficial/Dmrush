import { Container } from "@/components/ui/Container";
import { CourseVisual } from "@/components/courses/CourseVisuals";
import type { Course } from "@/content/courses";

export function BuildItSection({ course }: { course: Course }) {
  return (
    <section className="bg-cream py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
            <CourseVisual theme={course.visualTheme} variant="practice" className="absolute inset-0" />
          </div>
          <div>
            <p className="t-label text-accent">Practical work</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
              Don&apos;t just learn it. Build it.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted md:text-base">{course.buildItIntro}</p>
            <ul className="mt-6 space-y-2.5">
              {course.practicalTraining.slice(0, 7).map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
