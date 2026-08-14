import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function WhyDmrush() {
  const { why } = homeCopy;

  return (
    <section className="bg-cream py-20 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="t-label text-accent">{why.eyebrow}</p>
          <h2 className="t-h2 mt-4 text-ink">{why.title}</h2>
        </div>
        <ol className="mt-12 grid gap-0 border-t border-line md:grid-cols-2">
          {why.items.map((item) => (
            <li
              key={item.number}
              className="border-b border-line py-8 md:border-r md:px-8 md:odd:pl-0 md:even:border-r-0 md:even:pr-0"
            >
              <p className="text-4xl font-bold tracking-[-0.06em] text-accent">{item.number}</p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-7 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
