import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { publicNav, siteConfig } from "@/lib/site";
import { MobileNav } from "@/components/public/MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <div className="flex items-center gap-6">
          <Logo showLearn />
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink/75 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={siteConfig.agencyUrl}
            className="mr-1 text-xs font-semibold text-muted hover:text-accent"
          >
            {siteConfig.agencyLabel}
          </a>
          <Button href="/login" variant="secondary" size="sm">
            Student Login
          </Button>
          <Button href="/courses" variant="signal" size="sm">
            Explore Courses
          </Button>
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}
