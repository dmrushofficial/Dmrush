import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function GoogleAdsFeature() {
  const { ads } = homeCopy;

  return (
    <section className="bg-panel py-20 text-ink md:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="t-label text-accent">{ads.eyebrow}</p>
            <h2 className="t-h2 mt-4">{ads.title}</h2>
            <p className="t-body mt-5 max-w-xl text-muted">{ads.body}</p>
            <ul className="mt-8 space-y-2.5">
              {ads.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink/80">
                  <CheckIcon className="text-signal" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {ads.flow.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em]">
                    {step}
                  </span>
                  {index < ads.flow.length - 1 ? (
                    <span aria-hidden="true" className="text-signal">
                      →
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
            <Link
              href={ads.cta.href as Route}
              className="mt-8 inline-block text-sm font-bold text-accent hover:underline"
            >
              {ads.cta.label} →
            </Link>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-sm">
            <Photo
              src="/images/home/google-ads.png"
              alt="Paid search ad experience on mobile"
              className="aspect-[4/3] min-h-[340px] w-full"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
