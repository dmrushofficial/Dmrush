import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function HomeHero() {
  const { hero } = homeCopy;

  return (
    <section className="relative overflow-hidden bg-cream tx-arabic text-ink">
      <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="t-label text-accent">{hero.eyebrow}</p>
          <h1 className="t-hero mt-4 text-ink">
            {hero.lines.map((line, index) => (
              <span
                key={line}
                className={`block ${index === hero.lines.length - 1 ? "text-accent" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted">{hero.body}</p>
          <div className="mt-7">
            <Button href={hero.primaryCta.href} variant="signal" size="lg">
              {hero.primaryCta.label} →
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {hero.trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted">
                <CheckIcon className="text-signal" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-xl lg:aspect-[6/5] lg:min-h-[480px]">
            <Photo
              src="/images/home/hero-growth.png"
              alt="DMrush digital marketing agency office with branded workspace"
              fillParent
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
