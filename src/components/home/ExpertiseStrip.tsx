import { Container } from "@/components/ui/Container";
import { StripIcon } from "@/components/home/HomeIcons";
import { homeCopy } from "@/content/home";

export function ExpertiseStrip() {
  return (
    <div className="border-y border-line bg-surface">
      <Container className="grid grid-cols-2 gap-x-4 gap-y-8 py-8 sm:grid-cols-3 lg:grid-cols-6">
        {homeCopy.expertiseStrip.map((item, index) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-accent">
              <StripIcon index={index} className="h-5 w-5" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
              {item.label}
            </p>
            <p className="text-[11px] leading-snug text-muted">{item.desc}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}
