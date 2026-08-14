import type { Route } from "next";
import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies";

type CaseStudyCardProps = {
  study: CaseStudy;
};

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <article className="border-t border-line pt-6">
      <h3 className="text-lg font-semibold tracking-tight">
        <Link href={study.href as Route} className="hover:text-accent">
          {study.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-prose text-sm leading-6 text-muted">
        {study.summary}
      </p>
      {study.services.length > 0 ? (
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
          {study.services.join(" · ")}
        </p>
      ) : null}
    </article>
  );
}
