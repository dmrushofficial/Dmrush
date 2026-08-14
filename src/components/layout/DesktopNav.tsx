import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/content/navigation";
import { NavDropdown } from "@/components/layout/NavDropdown";

export function DesktopNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Primary" className={cn("items-center gap-7", className)}>
      {primaryNav.map((item) => {
        if ("children" in item) {
          return (
            <NavDropdown key={item.label} label={item.label} items={item.children} />
          );
        }

        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 text-base font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
              <span aria-hidden="true" className="text-xs">
                ↗
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className="text-base font-medium text-ink/70 transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
