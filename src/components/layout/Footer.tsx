import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { footerNav } from "@/content/navigation";
import { siteConfig } from "@/lib/site";
import { SocialIcon } from "@/components/ui/SocialIcons";

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
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-5 max-w-[16rem] text-sm leading-7 text-muted">
            {siteConfig.tagline}
          </p>
          <div className="mt-5 flex gap-2">
            {siteConfig.social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-accent hover:text-accent"
              >
                <SocialIcon name={item.id} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <FooterList title="Services" items={footerNav.services} />
        <FooterList title="Company" items={footerNav.company} />
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
        <div className="flex flex-wrap gap-6">
          <Link href="/privacy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-accent">
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  );
}
