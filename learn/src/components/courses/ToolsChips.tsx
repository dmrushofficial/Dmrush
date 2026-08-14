import { Container } from "@/components/ui/Container";
import { toolsDisclaimer } from "@/content/courses";

export function ToolsChips({ tools }: { tools: string[] }) {
  return (
    <section className="bg-cream py-10 md:py-12">
      <Container>
        <p className="t-label text-accent">Tools you&apos;ll work with</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">
          Platforms used in modern practice
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li
              key={tool}
              className="rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-sm"
            >
              {tool}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-5 text-muted">{toolsDisclaimer}</p>
      </Container>
    </section>
  );
}
