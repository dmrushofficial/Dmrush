import { Container } from "@/components/ui/Container";

const steps = [
  { label: "Learn", hint: "Live classes" },
  { label: "Practice", hint: "Hands-on labs" },
  { label: "Build", hint: "Real projects" },
  { label: "Portfolio", hint: "Show your work" },
];

export function LearningMethodBand() {
  return (
    <section className="border-y border-line bg-panel py-10 md:py-12">
      <Container>
        <h2 className="text-center text-xl font-bold tracking-[-0.03em] text-ink md:text-2xl">
          Learn → Practice → Build → Portfolio
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="rounded-2xl border border-line bg-surface px-4 py-4 text-center"
            >
              <p className="text-xs font-bold text-signal">0{index + 1}</p>
              <p className="mt-1 text-sm font-bold text-ink">{step.label}</p>
              <p className="mt-1 text-xs text-muted">{step.hint}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-muted">
          At DMRUSH, courses are designed around practical learning and project-based skill development.
        </p>
      </Container>
    </section>
  );
}
