export function TeamHeroVisual() {
  const seats = [
    { n: "01", label: "Leadership", detail: "Direction and delivery" },
    { n: "02", label: "SEO", detail: "Search that compounds" },
    { n: "03", label: "Marketing", detail: "Campaigns and brand" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-accent p-6 text-on-accent sm:p-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
          DMrush operators
        </p>
        <p className="mt-3 max-w-xs text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
          One table. Three seats. The work stays here.
        </p>
      </div>

      <ul className="space-y-3">
        {seats.map((seat) => (
          <li
            key={seat.n}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="text-xs font-bold text-signal">{seat.n}</span>
            <div>
              <p className="text-sm font-bold">{seat.label}</p>
              <p className="text-xs text-on-accent/70">{seat.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-accent/55">
        Search · Marketing · Delivery
      </p>
    </div>
  );
}
