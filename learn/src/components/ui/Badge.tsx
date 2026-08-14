import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "signal" | "success" | "warning" | "danger" | "accent";
}) {
  const tones = {
    neutral: "bg-panel text-ink",
    signal: "bg-signal/20 text-ink",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    accent: "bg-accent text-on-accent",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
