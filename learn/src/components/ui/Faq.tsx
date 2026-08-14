"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type FaqItem = { question: string; answer: string };

export function Faq({
  title,
  items,
  headingId = "faq",
}: {
  title: string;
  items: FaqItem[];
  headingId?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <h2 id={headingId} className="t-h2 text-ink">
        {title}
      </h2>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <li key={item.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="text-base font-semibold text-ink md:text-lg">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-sm font-bold text-accent",
                    isOpen && "bg-accent text-on-accent",
                  )}
                  aria-hidden
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen ? (
                <p className="pb-5 pr-12 text-sm leading-7 text-muted md:text-base">
                  {item.answer}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
