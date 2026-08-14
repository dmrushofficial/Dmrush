import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { getService } from "@/content/services";
import { homeCopy } from "@/content/home";

export function HomeServices() {
  const { services } = homeCopy;

  return (
    <section className="bg-cream py-20 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="t-label text-accent">{services.eyebrow}</p>
          <h2 className="t-h2 mt-4 text-ink">{services.title}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.items.map((item) => {
            const service = getService(item.slug);

            return (
              <Link
                key={item.slug}
                href={service.href as Route}
                className={`group flex min-h-[320px] flex-col rounded-[1.25rem] p-7 transition-transform hover:-translate-y-1 ${
                  item.featured
                    ? "border-2 border-signal bg-surface text-ink shadow-xl xl:min-h-[360px]"
                    : "border border-line bg-surface text-ink shadow-sm"
                }`}
              >
                <span className="text-3xl font-bold tracking-[-0.06em] text-accent">
                  {item.number}
                </span>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em]">{service.navLabel}</h3>
                <p className="mt-3 text-base leading-7 text-muted">{item.proposition}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                      <CheckIcon className="mt-0.5 shrink-0 text-signal" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm font-bold text-accent group-hover:underline">
                  Explore {service.shortName} →
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
