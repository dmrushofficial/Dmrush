"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export type NavItem = { label: string; href: string };

export function DashboardShell({
  brand,
  nav,
  userName,
  userRole,
  children,
}: {
  brand: string;
  nav: NavItem[];
  userName: string;
  userRole: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-line bg-surface transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Logo showLearn imageClassName="h-7 w-auto" />
            <button
              type="button"
              className="rounded-md border border-line px-2 py-1 text-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="t-label text-muted">{brand}</p>
            <p className="mt-2 text-sm font-semibold">{userName}</p>
            <p className="text-xs text-muted">{userRole}</p>
          </div>
          <nav className="space-y-1 px-3 pb-24" aria-label="Dashboard">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-on-accent"
                      : "text-ink/80 hover:bg-panel",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-line p-4">
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink hover:bg-panel"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
            <Link href="/" className="block text-sm font-semibold text-muted hover:text-accent">
              ← Institute site
            </Link>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
            aria-label="Close overlay"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              Menu
            </button>
            <p className="hidden text-sm text-muted lg:block">
              {brand} portal · signed in
            </p>
            <div className="ml-auto rounded-lg border border-line px-3 py-2 text-sm font-semibold">
              {userName}
            </div>
          </header>
          <div className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
