import { Container } from "@/components/ui/Container";
import type { Course } from "@/content/courses";

const icons = {
  learn: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  who: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  practice: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
};

export function AboutThisCourse({ course }: { course: Course }) {
  const cards = [
    { title: "What You'll Learn", body: course.aboutWhat, icon: icons.learn },
    { title: "Who It's For", body: course.aboutWho, icon: icons.who },
    { title: "How You'll Practice", body: course.aboutPractice, icon: icons.practice },
  ];

  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <p className="t-label text-accent">About this course</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Built for practical skill — not long lectures alone
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-line bg-cream p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-on-accent">
                {card.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
