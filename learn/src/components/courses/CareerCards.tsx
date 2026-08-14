import { Container } from "@/components/ui/Container";

export function CareerCards({ roles }: { roles: string[] }) {
  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <p className="t-label text-accent">Where this skill can take you</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Realistic roles and services
        </h2>
        <p className="mt-2 text-sm text-muted">No salary or job guarantees — skill pathways only.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.slice(0, 6).map((role) => (
            <li
              key={role}
              className="rounded-2xl border border-line bg-cream px-5 py-4 text-sm font-bold text-ink"
            >
              {role}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
