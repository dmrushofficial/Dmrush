import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/home/Photo";
import { homeCopy } from "@/content/home";

export function LearnBand() {
  const { learn } = homeCopy;

  return (
    <section className="bg-panel py-20 text-ink md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <p className="t-label text-accent">{learn.eyebrow}</p>
          <h2 className="t-h2 mt-4">{learn.title}</h2>
          <p className="t-body mt-5 max-w-xl text-muted">{learn.body}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {learn.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold shadow-sm"
              >
                {topic}
              </li>
            ))}
          </ul>
          <a
            href={learn.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-signal px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-signal-hover"
          >
            {learn.cta.label} ↗
          </a>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-sm">
          <Photo
            src="/images/home/learn.png"
            alt="DMrush Learn digital skills training workspace"
            className="aspect-[16/10] min-h-[280px] w-full"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
