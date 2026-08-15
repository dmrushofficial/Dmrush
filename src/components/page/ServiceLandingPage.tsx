import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { CheckIcon } from "@/components/home/HomeIcons";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceLanding } from "@/content/service-landings";
import { getService, services, type ServiceSlug } from "@/content/services";
import {
  breadcrumbNode,
  serviceNode,
  webPageNode,
} from "@/lib/schema";

type ServiceLandingPageProps = {
  slug: ServiceSlug;
};

export function ServiceLandingPage({ slug }: ServiceLandingPageProps) {
  const service = getService(slug);
  const content = getServiceLanding(slug);
  const { hero, problem, includes, process, outcomes, faq, finalCta } = content;
  const related = services.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: content.metaTitle,
            description: service.description,
            path: service.href,
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: service.name, path: service.href },
          ]),
          serviceNode({
            name: service.name,
            description: service.description,
            path: service.href,
          }),
        ]}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        image={{ src: hero.image, alt: hero.imageAlt }}
        primaryCta={hero.primaryCta}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{problem.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{problem.title}</h2>
            <p className="t-body mt-5 text-muted">{problem.body}</p>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {problem.points.map((point, index) => (
              <li
                key={point.title}
                className="rounded-2xl border border-line bg-cream p-6"
              >
                <p className="text-sm font-bold text-accent">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{includes.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{includes.title}</h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includes.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{process.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{process.title}</h2>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {process.steps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl border border-line bg-cream p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-xs font-bold text-ink">
                  {step.number.replace(/^0/, "")}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-panel tx-arabic py-16 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="t-label text-accent">{outcomes.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{outcomes.title}</h2>
            <ul className="mt-8 space-y-3">
              {outcomes.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-ink/80">
                  <CheckIcon className="mt-1 shrink-0 text-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-surface p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              {outcomes.pathLabel}
            </p>
            <ol className="mt-6 space-y-4">
              {outcomes.path.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-panel text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-ink">{step}</span>
                  {index < outcomes.path.length - 1 ? (
                    <span className="ml-auto text-signal" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
            Related services
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href as Route}
                  className="group block h-full rounded-2xl border border-line bg-cream p-6 transition-transform hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold text-ink group-hover:text-accent">
                    {item.navLabel}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.homeSummary}</p>
                  <p className="mt-4 text-sm font-bold text-accent">Explore →</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container className="max-w-4xl">
          <Faq
            title={faq.title}
            items={[...faq.items]}
            headingId={`${slug}-faq`}
          />
        </Container>
      </section>

      <section className="bg-panel tx-arabic py-16 md:py-20">
        <Container className="mx-auto max-w-3xl text-center">
          <h2 className="t-h2 text-ink">{finalCta.title}</h2>
          <p className="t-body mx-auto mt-5 max-w-2xl text-muted">{finalCta.body}</p>
          <div className="mt-8">
            <Button href={finalCta.primary.href} variant="signal" size="lg">
              {finalCta.primary.label} →
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
