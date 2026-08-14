"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import type { NavLink } from "@/content/navigation";

type NavDropdownProps = {
  label: string;
  items: NavLink[];
};

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-base font-medium text-ink/70 hover:text-ink"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        <span aria-hidden="true" className="text-[10px]">
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 min-w-64 rounded-xl border border-line bg-surface py-3 shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              role="menuitem"
              className={`block px-5 py-2.5 text-base text-ink/75 hover:bg-cream hover:text-ink ${
                item.separated ? "mt-1 border-t border-line pt-3" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
