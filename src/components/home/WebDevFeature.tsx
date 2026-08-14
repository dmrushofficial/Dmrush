import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function WebDevFeature() {
  const { web } = homeCopy;

  return (
    <section className="bg-cream py-20 text-ink md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="t-label text-accent">{web.eyebrow}</p>
          <h2 className="t-h2 mt-4">{web.title}</h2>
          <p className="t-body mt-5 max-w-xl text-muted">{web.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {web.bullets.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-ink/80">
                <CheckIcon className="text-signal" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={web.cta.href as Route}
            className="mt-8 inline-block text-sm font-bold text-accent hover:underline"
          >
            {web.cta.label} →
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-[1.5rem] border border-line shadow-sm">
          <Photo
            src="/images/home/web-dev.png"
            alt="Desktop and mobile website design showcase"
            className="aspect-[4/3] min-h-[340px] w-full"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
