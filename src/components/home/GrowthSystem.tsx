import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function GrowthSystem() {
  const { system } = homeCopy;

  return (
    <section className="bg-cream py-20 text-ink md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="t-label text-accent">{system.eyebrow}</p>
          <h2 className="t-h2 mt-4">
            {system.title}{" "}
            <span className="text-accent">{system.titleAccent}</span>
          </h2>
          <p className="t-body mt-5 text-muted">{system.body}</p>
        </div>
        <div className="mt-14 overflow-x-auto pb-2">
          <div className="mx-auto flex min-w-[720px] max-w-5xl flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {system.channels.map((channel, index) => (
                <span key={channel} className="flex items-center gap-3">
                  <span className="rounded-full border border-signal/40 bg-surface px-5 py-2.5 text-sm font-bold text-accent">
                    {channel}
                  </span>
                  {index < system.channels.length - 1 ? (
                    <span className="text-signal" aria-hidden="true">
                      +
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
            <span className="text-2xl text-signal" aria-hidden="true">
              ↑
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {system.stages.map((stage, index) => (
                <span key={stage} className="flex items-center gap-3">
                  <span className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold">
                    {stage}
                  </span>
                  {index < system.stages.length - 1 ? (
                    <span className="text-signal" aria-hidden="true">
                      ↑
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
