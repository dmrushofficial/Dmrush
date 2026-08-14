type FaqItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: FaqItem[];
  title?: string;
  headingId?: string;
  compact?: boolean;
};

export function Faq({
  items,
  title = "Questions",
  headingId = "faq-heading",
  compact = false,
}: FaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className={compact ? "text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl" : "t-h2 text-ink"}
      >
        {title}
      </h2>
      <div className={`mt-8 divide-y divide-line border-y border-line ${compact ? "" : "mt-10"}`}>
        {items.map((item) => (
          <details key={item.question} className={`group ${compact ? "py-5" : "py-6 md:py-7"}`}>
            <summary className="cursor-pointer list-none text-base font-semibold tracking-[-0.02em] marker:content-none md:text-lg [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-6 text-ink">
                {item.question}
                <span
                  aria-hidden="true"
                  className="mt-1 text-2xl leading-none text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted md:text-lg">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
