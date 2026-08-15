import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { caseStudies } from "@/content/case-studies";
import { homeCopy } from "@/content/home";

export function HomeCaseStudies() {
  const { caseStudies: copy } = homeCopy;

  return (
    <section className="bg-cream py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-label text-accent">{copy.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{copy.title}</h2>
          </div>
          <Link
            href={copy.href as Route}
            className="text-sm font-bold text-ink hover:text-accent"
          >
            View all case studies →
          </Link>
        </div>
        {caseStudies.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
            <p className="mx-auto max-w-xl text-base leading-7 text-muted">{copy.empty}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
