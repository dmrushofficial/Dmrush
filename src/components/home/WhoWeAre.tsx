import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/home/HomeIcons";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function WhoWeAre() {
  const { who } = homeCopy;

  return (
    <section className="bg-cream py-20 md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="t-label text-accent">{who.eyebrow}</p>
          <h2 className="t-h2 mt-4 text-ink">
            {who.title}{" "}
            <span className="text-accent">{who.titleAccent}</span>
          </h2>
          <p className="t-body mt-6 max-w-xl text-muted">{who.body}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {who.points.map((point, index) => (
              <li
                key={point.title}
                className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-panel text-accent">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-lg font-bold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-[1.5rem] border border-line shadow-sm">
          <Photo
            src="/images/home/strategy.png"
            alt="Strategy and technology workspace representing DMrush capabilities"
            className="aspect-[4/3] min-h-[320px] w-full lg:min-h-[480px]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
