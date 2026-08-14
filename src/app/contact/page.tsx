import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/ui/ContactForm";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPage } from "@/content/contact";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";

export const metadata = createPageMetadata({
  title: contactPage.metaTitle,
  description: contactPage.metaDescription,
  path: "/contact",
});

export default function ContactPage() {
  const { hero, form, nextSteps, aside } = contactPage;

  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: contactPage.metaTitle,
            description: contactPage.metaDescription,
            path: "/contact",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
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
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,22rem)] lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
                {form.title}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted">{form.body}</p>
              <div className="mt-8 rounded-[1.5rem] border border-line bg-cream p-6 md:p-8">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-[1.5rem] border border-line bg-panel tx-arabic p-6 md:p-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
                  {aside.title}
                </h2>
                <p className="mt-5 text-sm font-semibold text-ink">{aside.emailLabel}</p>
                <a
                  href={`mailto:${aside.email}`}
                  className="mt-2 block text-lg font-bold text-ink hover:text-accent"
                >
                  {aside.email}
                </a>
                <p className="mt-4 text-sm leading-6 text-muted">{aside.note}</p>
                <div className="mt-6 flex flex-col gap-3">
                  {aside.ctas.map((cta) => (
                    <Button key={cta.label} href={cta.href} variant="signal" size="lg">
                      {cta.label} →
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="t-label text-accent">{nextSteps.eyebrow}</p>
                <h2 className="mt-3 text-xl font-bold text-ink">{nextSteps.title}</h2>
                <ol className="mt-6 space-y-4">
                  {nextSteps.items.map((item) => (
                    <li key={item.number} className="rounded-2xl border border-line bg-cream p-5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-xs font-bold text-ink">
                        {item.number.replace(/^0/, "")}
                      </span>
                      <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
