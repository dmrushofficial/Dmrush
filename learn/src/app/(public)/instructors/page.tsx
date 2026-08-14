import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { instructors } from "@/content/instructors";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Instructors",
  description: "DMrush Learn instructors. Profiles will be published as they are confirmed.",
  path: "/instructors",
});

export default function InstructorsPage() {
  return (
    <>
      <section className="border-b border-line bg-cream tx-paper">
        <Container className="py-14 lg:py-20">
          <p className="t-label text-accent">Instructors</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">Practitioner-led courses. Profiles coming soon.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
            Placeholder cards are ready for real instructor names, roles, photos, and expertise.
            We are not inventing identities for this demo.
          </p>
        </Container>
      </section>
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((person) => (
              <li key={person.id} className="rounded-2xl border border-line bg-cream p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-panel text-sm font-bold text-accent">
                  TBA
                </div>
                <h2 className="mt-5 text-xl font-bold text-ink">{person.name}</h2>
                <p className="mt-1 text-sm font-semibold text-accent">{person.role}</p>
                <p className="mt-4 text-sm text-muted">Course: {person.courseTaught}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted">
                  {person.expertise}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="/contact" variant="signal">
              Inquire about courses →
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
