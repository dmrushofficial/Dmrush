"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import type { CurriculumPeriod } from "@/content/courses";
import { cn } from "@/lib/cn";

export function CurriculumAccordion({ periods }: { periods: CurriculumPeriod[] }) {
  const [open, setOpen] = useState<string | null>(periods[0]?.periodLabel ?? null);

  return (
    <section id="curriculum" className="scroll-mt-24 bg-surface py-12 md:py-16">
      <Container>
        <p className="t-label text-accent">Curriculum</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Detailed learning path — expand what you need
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Full module depth stays available. Only one period opens by default so the page stays scannable.
        </p>
        <div className="mt-8 space-y-3">
          {periods.map((period) => {
            const isOpen = open === period.periodLabel;
            return (
              <div key={period.periodLabel} className="overflow-hidden rounded-2xl border border-line bg-cream">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : period.periodLabel)}
                >
                  <span>
                    <span className="block text-lg font-bold text-ink">{period.periodLabel}</span>
                    <span className="mt-0.5 block text-sm font-medium text-accent">{period.theme}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-sm font-bold text-accent",
                      isOpen && "bg-accent text-on-accent",
                    )}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="space-y-4 border-t border-line px-5 py-5">
                    {period.modules.map((module) => (
                      <div key={module.title} className="rounded-xl border border-line bg-surface p-4">
                        <h3 className="font-semibold text-ink">{module.title}</h3>
                        <p className="mt-1 text-sm text-muted">{module.summary}</p>
                        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                          {module.topics.slice(0, 6).map((topic) => (
                            <li key={topic} className="flex gap-2 text-sm text-ink/85">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                              {topic}
                            </li>
                          ))}
                        </ul>
                        {module.assignment ? (
                          <p className="mt-3 rounded-lg bg-panel px-3 py-2 text-xs font-medium text-ink">
                            Practical: {module.assignment}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
