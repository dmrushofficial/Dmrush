import { Suspense } from "react";
import { ContactForm } from "@/components/public/ContactForm";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact DMrush Learn for course and admission questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-cream tx-paper">
        <Container className="py-14 lg:py-20">
          <p className="t-label text-accent">Contact</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">Ask about courses or admission.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
            This is a frontend inquiry form for demo purposes. Backend routing will be connected later.
          </p>
        </Container>
      </section>
      <section className="bg-surface py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-line bg-cream p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink">Admission inquiry</h2>
            <p className="mt-2 text-sm text-muted">
              Tell us which course you are interested in and we will follow up once intake is live.
            </p>
            <div className="mt-6">
              <Suspense fallback={<p className="text-sm text-muted">Loading form…</p>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
          <aside className="rounded-2xl border border-line bg-panel p-6 md:p-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
              Direct email
            </h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 block text-xl font-bold text-ink hover:text-accent"
            >
              {siteConfig.email}
            </a>
            <p className="mt-4 text-sm leading-6 text-muted">
              Phone, address, and scheduling links will be added when confirmed. We are not publishing
              placeholder office details.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
