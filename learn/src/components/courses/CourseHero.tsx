import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CourseBreadcrumbs } from "@/components/courses/CourseBreadcrumbs";
import { CourseVisual } from "@/components/courses/CourseVisuals";
import type { Course } from "@/content/courses";

export function CourseHero({ course }: { course: Course }) {
  const applyHref = `/contact?course=${course.slug}`;

  return (
    <section className="border-b border-line bg-cream">
      <Container className="py-8 md:py-12 lg:py-14">
        <CourseBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.title },
          ]}
        />
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge tone="accent">{course.category}</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {course.title}
            </h1>
            <p className="mt-4 text-lg font-semibold tracking-[-0.02em] text-ink/90 md:text-xl">
              {course.headline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
              {course.valueProposition}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                course.duration,
                `${course.classesPerWeek} classes/week`,
                course.days,
                course.classTime,
                "On-Campus",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={applyHref} variant="signal" size="lg">
                Apply Now
              </Button>
              <Button href="#curriculum" variant="secondary" size="lg">
                View Curriculum
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
            <CourseVisual theme={course.visualTheme} variant="hero" priority className="absolute inset-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
