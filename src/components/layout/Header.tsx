import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { ctas } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 text-ink backdrop-blur-sm supports-[backdrop-filter]:bg-surface/85">
      <Container className="relative flex h-20 items-center justify-between xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <DesktopNav className="hidden xl:flex xl:justify-self-center" />
        <div className="hidden xl:block xl:justify-self-end">
          <Button href={ctas.primary.href} variant="signal">
            {ctas.primary.label} →
          </Button>
        </div>
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
