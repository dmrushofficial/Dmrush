import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { footerNav } from "@/content/navigation";
import { siteConfig } from "@/lib/site";

function FooterList({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            {item.external ? (
              <a href={item.href} className="text-sm text-ink/70 hover:text-accent">
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href as Route}
                className="text-sm text-ink/70 hover:text-accent"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream text-ink">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
            {siteConfig.tagline}
          </p>
          <div className="mt-6 flex gap-2.5">
            {["Fb", "X", "Ig", "In", "Yt"].map((label) => (
              <span
                key={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-[10px] font-bold text-muted"
                aria-hidden="true"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <FooterList title="Services" items={footerNav.services} />
        <FooterList title="Company" items={footerNav.company} />
        <FooterList title="Resources" items={footerNav.resources} />
        <FooterList title="Learn" items={footerNav.learn} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/70">
            <li>{siteConfig.address}</li>
            <li>
              <a href={siteConfig.whatsappUrl} className="hover:text-accent" target="_blank" rel="noreferrer">
                WhatsApp {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                Book a Strategy Call
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </Container>
    </footer>
  );
}
