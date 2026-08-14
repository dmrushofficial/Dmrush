import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

const spacingStyles = {
  none: "",
  compact: "py-8 md:py-10",
  moderate: "py-14 md:py-20",
  default: "py-16 md:py-24",
  major: "py-20 md:py-28",
} as const;

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  as?: "section" | "div";
  spacing?: keyof typeof spacingStyles;
};

export function Section({
  children,
  className,
  containerClassName,
  id,
  as: Component = "section",
  spacing = "default",
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(spacingStyles[spacing], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </Component>
  );
}
