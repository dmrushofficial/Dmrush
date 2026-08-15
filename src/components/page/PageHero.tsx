import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/home/Photo";

type Cta = { label: string; href: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
  visual?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

export function PageHero({
  eyebrow,
  title,
  body,
  image,
  visual,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cream tx-arabic text-ink">
      <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="t-label text-accent">{eyebrow}</p>
          <h1 className="t-h2 mt-4 text-ink">{title}</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted md:text-lg">{body}</p>
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <Button href={primaryCta.href} variant="signal" size="lg">
                  {primaryCta.label} →
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="darkOutline" size="lg">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-xl lg:aspect-[6/5] lg:min-h-[420px]">
            {visual ? (
              visual
            ) : image ? (
              <Photo
                src={image.src}
                alt={image.alt}
                fillParent
                sizes="(min-width: 1024px) 48vw, 100vw"
                priority
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
