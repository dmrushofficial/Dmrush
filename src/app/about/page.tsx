import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutPage } from "@/content/about";
import { services } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";

export const metadata = createPageMetadata({
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
  path: "/about",
});

export default function AboutPage() {
  const { hero, story, approach, beliefs, finalCta } = aboutPage;

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: aboutPage.metaTitle,
            description: aboutPage.metaDescription,
            path: "/about",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="border-b border-line bg-cream tx-arabic">
        <Container className="py-14 lg:py-20">
          <p className="t-label text-accent">{hero.eyebrow}</p>
          <h1 className="t-h2 mt-4 max-w-4xl text-ink">{hero.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
            {hero.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={finalCta.primary.href} variant="signal" size="lg">
              {finalCta.primary.label} →
            </Button>
            <Button href="/team" variant="darkOutline" size="lg">
              Meet the team
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{story.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{story.title}</h2>
            <p className="t-body mt-5 text-muted">{story.body}</p>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {story.points.map((point, index) => (
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
            <p className="t-label text-accent">{approach.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{approach.title}</h2>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {approach.items.map((item) => (
              <li key={item.number} className="rounded-2xl border border-line bg-surface p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-xs font-bold text-ink">
                  {item.number.replace(/^0/, "")}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="t-label text-accent">Services</p>
              <h2 className="t-h2 mt-4 text-ink">What we help businesses grow with.</h2>
            </div>
            <Link href={"/contact" as Route} className="text-sm font-bold text-accent hover:underline">
              Start a conversation →
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href as Route}
                  className="group block h-full rounded-2xl border border-line bg-cream p-6 transition-transform hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold text-ink group-hover:text-accent">
                    {service.navLabel}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{service.homeSummary}</p>
                  <p className="mt-4 text-sm font-bold text-accent">Explore →</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-panel tx-arabic py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="t-label text-accent">{beliefs.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{beliefs.title}</h2>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {beliefs.items.map((item) => (
              <li key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <Container className="mx-auto max-w-3xl text-center">
          <h2 className="t-h2 text-ink">{finalCta.title}</h2>
          <p className="t-body mx-auto mt-5 max-w-2xl text-muted">{finalCta.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={finalCta.primary.href} variant="signal" size="lg">
              {finalCta.primary.label} →
            </Button>
            <Button href={finalCta.secondary.href} variant="darkOutline" size="lg">
              {finalCta.secondary.label}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
