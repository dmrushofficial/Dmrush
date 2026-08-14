import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-5 md:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-[-0.02em] text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line bg-cream px-4 py-6 text-sm text-muted">
      {children}
    </p>
  );
}
