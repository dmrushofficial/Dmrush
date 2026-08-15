import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ctas } from "@/lib/site";
import { cn } from "@/lib/cn";

type CtaSectionProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  tone?: "default" | "dark";
  align?: "start" | "center";
};

export function CtaSection({
  title = "Ready to build a stronger digital presence?",
  description = "Book a strategy call to talk through search, web, and growth.",
  primaryLabel = ctas.primary.label,
  tone = "default",
  align = "start",
}: CtaSectionProps) {
  const isDark = tone === "dark";
  const isCentered = align === "center";

  return (
    <Section
      spacing={isCentered ? "major" : "default"}
      className={isDark ? "bg-accent text-on-accent" : "border-t border-line"}
    >
      <div
        className={cn(
          isCentered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        )}
      >
        <h2
          className={cn(
            "font-semibold tracking-[-0.03em]",
            isCentered
              ? "text-[1.85rem] md:text-[2.35rem]"
              : "text-[1.75rem] md:text-[2.125rem]",
            isDark && "text-on-accent",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-5 text-base leading-7 md:text-lg md:leading-8",
            isDark ? "text-on-accent/85" : "text-muted",
            isCentered && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
        <div
          className={cn(
            "mt-8",
            isCentered && "flex justify-center",
          )}
        >
          <Button
            href={ctas.primary.href}
            variant={isDark ? "inverse" : "primary"}
            size={isCentered ? "lg" : "md"}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </Section>
  );
}
