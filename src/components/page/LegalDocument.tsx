import { Container } from "@/components/ui/Container";
import type { LegalPage } from "@/content/legal";

export function LegalDocument({ document }: { document: LegalPage }) {
  return (
    <>
      <section className="border-b border-line bg-cream tx-arabic">
        <Container className="py-12 lg:py-16">
          <p className="t-label text-accent">Legal</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">{document.title}</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Effective {document.effectiveDate}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{document.intro}</p>
        </Container>
      </section>
      <section className="bg-surface py-12 md:py-16">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-ink">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-base leading-7 text-muted">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-muted">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
