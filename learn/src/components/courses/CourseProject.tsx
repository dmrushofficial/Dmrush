import { Container } from "@/components/ui/Container";
import type { Course } from "@/content/courses";

export function CourseProject({ course }: { course: Course }) {
  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <p className="t-label text-accent">Your course project</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Portfolio-ready deliverables
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-line bg-cream p-5">
            <h3 className="text-base font-bold text-ink">Mini projects</h3>
            <ul className="mt-4 space-y-3">
              {course.miniProjects.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
                  <span className="text-signal" aria-hidden>
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-signal/50 bg-accent p-6 text-on-accent shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal">Final project</p>
            <h3 className="mt-3 text-xl font-bold tracking-[-0.02em]">{course.finalProject.title}</h3>
            <p className="mt-3 text-sm leading-6 text-on-accent/80">{course.finalProject.description}</p>
            {course.finalProject.bullets?.length ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {course.finalProject.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
