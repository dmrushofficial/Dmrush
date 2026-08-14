import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="font-semibold text-ink">{clamped}%</span>
        </div>
      ) : null}
      <div
        className={cn("h-2 overflow-hidden rounded-full bg-line")}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-signal" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
