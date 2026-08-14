import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function CustomerJourney() {
  const { journey } = homeCopy;

  return (
    <section className="bg-surface py-20 text-ink md:py-24">
      <Container>
        <h2 className="t-h2 mx-auto max-w-3xl text-center">
          {journey.title}{" "}
          <span className="text-accent">{journey.titleAccent}</span>
        </h2>
        <div className="mt-14 overflow-x-auto pb-2">
          <ol className="flex min-w-[900px] items-start justify-between gap-2">
            {journey.steps.map((step, index) => (
              <li key={step.label} className="flex flex-1 items-start">
                <div className="w-full text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel text-sm font-bold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em]">{step.label}</p>
                  <p className="mt-2 text-sm text-muted">{step.desc}</p>
                </div>
                {index < journey.steps.length - 1 ? (
                  <span aria-hidden="true" className="mt-5 px-1 text-xl text-signal">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {journey.channels.map((channel) => (
            <li
              key={channel}
              className="rounded-full border border-line bg-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink/70"
            >
              {channel}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
