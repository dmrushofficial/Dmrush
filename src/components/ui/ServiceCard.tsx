import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ServiceCardProps = {
  href: string;
  name: string;
  summary: string;
  eyebrow?: string;
  className?: string;
};

export function ServiceCard({
  href,
  name,
  summary,
  eyebrow,
  className,
}: ServiceCardProps) {
  return (
    <article className={cn("border-t border-line pt-7", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-2 text-xl font-semibold tracking-tight">
        <Link href={href as Route} className="hover:text-accent">
          {name}
        </Link>
      </h3>
      <p className="mt-3 max-w-prose text-base leading-7 text-muted">{summary}</p>
      <p className="mt-4">
        <Link
          href={href as Route}
          className="text-[15px] font-medium text-foreground underline-offset-4 hover:underline"
        >
          View service
        </Link>
      </p>
    </article>
  );
}
