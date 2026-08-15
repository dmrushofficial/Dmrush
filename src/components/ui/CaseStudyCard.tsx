import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-sm">
      <Link href={study.href as Route} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden bg-panel">
          <Image
            src={study.image}
            alt={study.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </div>
        <div className="p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            {study.industry}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-ink group-hover:text-accent">
            {study.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted">{study.summary}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {study.stats.slice(0, 2).map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-sm font-bold text-ink">
                  {stat.before} → {stat.after}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {study.services.join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
