import { ContactForm } from "@/components/ui/ContactForm";
import { Container } from "@/components/ui/Container";
import { ContactMethods } from "@/components/page/ContactMethods";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPage } from "@/content/contact";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: contactPage.metaTitle,
  description: contactPage.metaDescription,
  path: "/contact",
});

export default function ContactPage() {
  const { hero, form, nextSteps } = contactPage;

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
        <Container className="py-12 lg:py-16">
          <p className="t-label text-accent">{hero.eyebrow}</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">{hero.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted md:text-lg">{hero.body}</p>
          <div className="mt-10">
            <ContactMethods email={siteConfig.email} />
          </div>
        </Container>
      </section>

      <section id="message" className="scroll-mt-24 bg-surface py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-line bg-cream p-6 shadow-sm md:p-8">
            <p className="t-label text-accent">Message</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
              {form.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{form.body}</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-cream py-14 md:py-20">
        <Container>
          <p className="t-label text-accent">{nextSteps.eyebrow}</p>
          <h2 className="t-h2 mt-3 text-ink">{nextSteps.title}</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {nextSteps.items.map((item) => (
              <li key={item.number} className="rounded-[1.35rem] border border-line bg-surface p-6">
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
    </>
  );
}
