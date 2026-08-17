import { Container } from "@/components/ui/Container";
import { StripIcon } from "@/components/home/HomeIcons";
import { homeCopy } from "@/content/home";

export function ExpertiseStrip() {
  return (
    <div className="border-y border-line bg-surface">
      <Container className="flex flex-wrap justify-center gap-x-6 gap-y-8 py-8 sm:gap-x-10 lg:gap-x-12">
        {homeCopy.expertiseStrip.map((item, index) => (
          <div
            key={item.label}
            className="flex w-[9.5rem] flex-col items-center gap-2 text-center sm:w-[10rem] lg:w-[11rem]"
          >
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
