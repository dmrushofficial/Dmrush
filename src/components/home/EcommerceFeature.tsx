import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function EcommerceFeature() {
  const { ecommerce } = homeCopy;

  return (
    <section className="bg-surface py-20 md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 overflow-hidden rounded-[1.5rem] border border-line shadow-sm lg:order-1">
          <Photo
            src="/images/home/ecommerce.png"
            alt="Ecommerce product experience and storefront interface"
            className="aspect-[4/3] min-h-[340px] w-full"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="t-label text-accent">{ecommerce.eyebrow}</p>
          <h2 className="t-h2 mt-4 text-ink">{ecommerce.title}</h2>
          <p className="t-body mt-5 max-w-xl text-muted">{ecommerce.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ecommerce.bullets.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-ink">
                <CheckIcon className="text-signal" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={ecommerce.cta.href as Route}
            className="mt-8 inline-block text-sm font-bold text-accent hover:underline"
          >
            {ecommerce.cta.label} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
