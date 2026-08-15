import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckIcon, GlobeIcon, PhoneIcon, PinIcon, SearchIcon } from "@/components/home/HomeIcons";
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
              alt="Digital growth composition showing search, maps, and website layers"
              fillParent
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
            <div className="absolute left-5 top-5 right-5 rounded-xl border border-line bg-surface/95 p-4 shadow-sm backdrop-blur-sm sm:left-8 sm:top-8 sm:right-auto sm:w-[260px]">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                <SearchIcon className="h-3.5 w-3.5 text-signal" />
                Google Search
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">digital marketing agency near me</p>
              <div className="mt-3 rounded-lg bg-cream p-3">
                <p className="text-xs font-bold text-accent">DMrush</p>
                <p className="mt-1 text-[11px] text-muted">SEO · Web · Paid Growth</p>
              </div>
            </div>
            <div className="absolute bottom-24 left-5 w-[140px] rounded-xl border border-line bg-surface/95 p-3 shadow-sm backdrop-blur-sm sm:left-8">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Maps</p>
              <div className="mt-2 flex h-14 items-center justify-center rounded-lg bg-cream text-signal">
                <PinIcon className="h-7 w-7" />
              </div>
            </div>
            <div className="absolute right-5 top-[40%] w-[170px] rounded-xl border border-line bg-surface/95 p-3 shadow-md backdrop-blur-sm sm:right-8">
              <div className="mb-2 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-signal/50" />
                <div className="h-2 w-full rounded bg-line" />
                <div className="mt-3 h-7 rounded-md bg-signal" />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <GlobeIcon className="h-3.5 w-3.5 text-signal" />
                Website
              </p>
            </div>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-surface/95 px-4 py-2.5 shadow-md backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-ink">
                <PhoneIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Lead converted
                </p>
                <p className="text-sm font-bold text-ink">Visibility → Growth</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
