import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary:
    "border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/5",
  inverse: "bg-surface text-ink hover:bg-white",
  inverseSecondary:
    "border border-on-accent/30 bg-transparent text-on-accent hover:bg-white/5",
  signal: "bg-signal text-ink hover:bg-signal-hover",
  signalOutline:
    "border border-signal bg-transparent text-signal hover:bg-signal/10",
  whiteOutline:
    "border border-white/35 bg-transparent text-on-accent hover:bg-white/5",
  darkOutline:
    "border border-ink/20 bg-transparent text-ink hover:bg-ink/5",
} as const;

const sizes = {
  md: "px-5 py-3 text-sm font-semibold",
  lg: "px-6 py-3.5 text-base font-semibold",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.01em] transition-colors disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(baseClassName, sizes[size], variants[variant], className);

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("#");

    if (isExternal) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href as Route} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
