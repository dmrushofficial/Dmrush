import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CaseStudy } from "@/content/case-studies";
import { caseStudies } from "@/content/case-studies";
import { ctas } from "@/lib/site";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";

export function CaseStudyDetail({ study }: { study: CaseStudy }) {
  const related = caseStudies.filter((item) => item.slug !== study.slug);

  return (
    <>
      <section className="border-b border-line bg-cream">
        <Container className="py-12 lg:py-16">
          <p className="t-label text-accent">{study.industry}</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">{study.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{study.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {study.services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
              >
                {service}
              </span>
            ))}
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
              {study.timeframe}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-10 md:py-14">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-line bg-panel shadow-sm">
            <Image
              src={study.image}
              alt={study.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream py-12 md:py-16">
        <Container>
          <p className="t-label text-accent">SEO results</p>
          <h2 className="t-h2 mt-3 text-ink">Before vs after.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            Client names and logos are kept off the snapshots. Numbers are from the tracked
            keyword set and Search Console for this engagement window.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {study.stats.map((stat) => (
              <li key={stat.label} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {stat.before}
                  <span className="mx-2 text-line">→</span>
                  <span className="text-2xl font-bold tracking-[-0.04em] text-ink">{stat.after}</span>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink">The problem</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{study.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink">What changed</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{study.result}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <Container>
          <p className="t-label text-accent">Rankings</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
            Tracked keywords
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-panel text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Keyword</th>
                  <th className="px-5 py-3 font-bold">Before</th>
                  <th className="px-5 py-3 font-bold">After</th>
                </tr>
              </thead>
              <tbody>
                {study.keywords.map((row) => (
                  <tr key={row.term} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 font-semibold text-ink">{row.term}</td>
                    <td className="px-5 py-3 text-muted">{row.before}</td>
                    <td className="px-5 py-3 font-bold text-accent">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <Container>
          <p className="t-label text-accent">Snapshots</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
            How the results look in the tools
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {study.shots.map((shot) => (
              <li key={shot.src + shot.caption}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-panel">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                </div>
                <p className="mt-3 text-sm text-muted">{shot.caption}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <Container>
          <p className="t-label text-accent">Work done</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
            What we actually shipped
          </h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {study.work.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-line bg-surface px-5 py-4 text-sm leading-6 text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {study.process.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm font-bold text-signal">0{index + 1}</p>
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-surface py-12 md:py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink">More work</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <CaseStudyCard study={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-panel py-16 md:py-20">
        <Container className="mx-auto max-w-3xl text-center">
          <h2 className="t-h2 text-ink">Want results like this?</h2>
          <p className="mt-4 text-base text-muted">
            Start with a strategy call or a free website and SEO audit.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={ctas.primary.href} variant="signal" size="lg">
              {ctas.primary.label} →
            </Button>
            <Button href="/case-studies" variant="darkOutline" size="lg">
              All case studies
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
