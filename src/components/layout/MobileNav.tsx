"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { primaryNav } from "@/content/navigation";
import { ctas } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="text-base font-medium text-ink"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-30 border-b border-line bg-surface shadow-lg"
        >
          <nav aria-label="Mobile" className="flex flex-col px-5 py-6 text-ink">
            {primaryNav.map((item) => {
              if ("children" in item) {
                return (
                  <div key={item.label} className="py-3">
                    <p className="t-label text-muted">{item.label}</p>
                    <div className="mt-2 flex flex-col">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href as Route}
                          className={`py-2.5 text-lg ${
                            child.separated
                              ? "mt-2 border-t border-line pt-4 text-muted"
                              : ""
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-2.5 text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="py-2.5 text-lg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-5 flex flex-col gap-3">
              <Button href={ctas.primary.href} variant="signal">
                {ctas.primary.label}
              </Button>
              <Button href={ctas.secondary.href} variant="secondary">
                {ctas.secondary.label}
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
