import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function BrandStatement() {
  const { statement } = homeCopy;

  return (
    <section className="bg-panel py-24 text-ink md:py-32">
      <Container>
        <h2 className="mx-auto max-w-5xl text-center font-bold tracking-[-0.05em] text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05]">
          <span className="block">{statement.line1}</span>
          <span className="mt-3 block text-accent">{statement.line2}</span>
        </h2>
      </Container>
    </section>
  );
}
