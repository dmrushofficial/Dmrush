import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CalendarIcon } from "@/components/home/HomeIcons";
import { homeCopy } from "@/content/home";

export function MidCta() {
  const { midCta } = homeCopy;

  return (
    <section className="bg-surface py-14 md:py-16">
      <Container>
        <div className="grid gap-8 rounded-[1.5rem] border border-line bg-panel tx-arabic px-6 py-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-10">
          <CalendarIcon className="hidden h-12 w-12 shrink-0 text-accent lg:block" />
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
  );
}
