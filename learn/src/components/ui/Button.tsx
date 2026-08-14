import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-ink/15 bg-transparent text-ink hover:bg-ink/5",
  signal: "bg-signal text-ink hover:bg-signal-hover",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  dark: "bg-ink text-white hover:bg-ink/90",
} as const;

const sizes = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
} as const;

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.01em] transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href && !disabled) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
