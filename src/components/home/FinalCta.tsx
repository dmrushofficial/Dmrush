import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function FinalCta() {
  const { finalCta } = homeCopy;

  return (
    <section className="bg-panel tx-arabic py-20 text-ink md:py-24">
      <Container className="mx-auto max-w-3xl text-center">
        <h2 className="t-h2">{finalCta.title}</h2>
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
  );
}
