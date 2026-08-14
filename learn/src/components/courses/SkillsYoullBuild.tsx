import { Container } from "@/components/ui/Container";
import type { CourseSkill } from "@/content/courses";

export function SkillsYoullBuild({ skills }: { skills: CourseSkill[] }) {
  return (
    <section className="bg-cream py-12 md:py-16">
      <Container>
        <p className="t-label text-accent">Skills you&apos;ll build</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Focused outcomes you can demonstrate
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <li
              key={skill.title}
              className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
            >
              <span className="text-xl" aria-hidden>
                {skill.icon}
              </span>
              <h3 className="mt-3 text-sm font-bold text-ink">{skill.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted">{skill.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
