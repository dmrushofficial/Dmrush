import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function HomeProcess() {
  const { process } = homeCopy;

  return (
    <section className="bg-surface py-20 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="t-label text-accent">{process.eyebrow}</p>
          <h2 className="t-h2 mt-4 text-ink">{process.title}</h2>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-5">
          {process.steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-line bg-cream p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-xs font-bold text-ink">
                {step.number.replace(/^0/, "")}
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                Step {step.number}
              </p>
              <h3 className="mt-2 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
