import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { CheckIcon } from "@/components/home/HomeIcons";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoPage } from "@/content/seo";
import { getService, services } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";
import {
  breadcrumbNode,
  serviceNode,
  webPageNode,
} from "@/lib/schema";

const service = getService("seo");

export const metadata = createPageMetadata({
  title: seoPage.metaTitle,
  description: seoPage.metaDescription,
  path: service.href,
});

export default function SeoPage() {
  const {
    hero,
    proofStrip,
    problem,
    pillars,
    includes,
    audience,
    process,
    midCta,
    outcomes,
    faq,
    finalCta,
  } = seoPage;

  const related = services
    .filter((item) =>
      ["web-development", "google-ads", "digital-marketing"].includes(item.slug),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: seoPage.metaTitle,
            description: seoPage.metaDescription,
            path: service.href,
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "SEO", path: service.href },
          ]),
          serviceNode({
            name: service.name,
            description: seoPage.metaDescription,
            path: service.href,
          }),
        ]}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        image={{
          src: "/images/home/seo-growth.png",
          alt: "Organic SEO growth analytics on a modern workstation",
        }}
        primaryCta={hero.primaryCta}
      />

      <div className="border-b border-line bg-surface">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6">
          {proofStrip.map((item) => (
            <span
              key={item}
              className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/65"
            >
              {item}
            </span>
          ))}
        </Container>
      </div>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{problem.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{problem.title}</h2>
            <p className="t-body mt-5 text-muted">{problem.body}</p>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {problem.points.map((point, index) => (
              <li key={point.title} className="rounded-2xl border border-line bg-cream p-6">
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
            <p className="t-label text-accent">{pillars.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{pillars.title}</h2>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {pillars.items.map((item) => (
              <li
                key={item.number}
                className="rounded-2xl border border-line bg-surface p-7 shadow-sm"
              >
                <p className="text-3xl font-bold tracking-[-0.06em] text-accent">
                  {item.number}
                </p>
                <h3 className="mt-4 text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{includes.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{includes.title}</h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includes.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-cream p-6"
              >
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-panel tx-arabic py-16 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="t-label text-accent">{audience.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{audience.title}</h2>
            <ul className="mt-8 space-y-3">
              {audience.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-ink/80">
                  <CheckIcon className="mt-1 shrink-0 text-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label text-accent">{outcomes.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
              {outcomes.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {outcomes.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-ink/80">
                  <CheckIcon className="mt-1 shrink-0 text-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
              <li key={step.number} className="rounded-2xl border border-line bg-cream p-6">
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

      <section className="bg-surface py-12 md:py-16">
        <Container>
          <div className="grid gap-8 rounded-[1.5rem] border border-line bg-panel tx-arabic px-6 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-10">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
                {midCta.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-muted">{midCta.body}</p>
            </div>
            <div>
              <Button href={midCta.primary.href} variant="signal" size="lg">
                {midCta.primary.label} →
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
            Related services
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href as Route}
                  className="group block h-full rounded-2xl border border-line bg-surface p-6 transition-transform hover:-translate-y-0.5"
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

      <section className="bg-surface py-16 md:py-24">
        <Container className="max-w-4xl">
          <Faq title={faq.title} items={[...faq.items]} headingId="seo-faq" />
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
