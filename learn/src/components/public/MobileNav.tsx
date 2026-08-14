"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { publicNav, siteConfig } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden className="text-lg font-bold">
          {open ? "×" : "☰"}
        </span>
      </button>
      {open ? (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 border-b border-line bg-cream px-5 py-5 shadow-sm"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a href={siteConfig.agencyUrl} className="text-sm font-semibold text-muted">
              {siteConfig.agencyLabel}
            </a>
            <div className="mt-2 flex flex-col gap-2">
              <Button href="/login" variant="secondary">
                Student Login
              </Button>
              <Button href="/courses" variant="signal">
                Explore Courses
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
