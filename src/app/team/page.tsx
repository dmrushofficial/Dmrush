import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/page/PageHero";
import { TeamHeroVisual } from "@/components/page/TeamHeroVisual";
import { TeamSocialLinks } from "@/components/page/TeamSocialLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { pages } from "@/content/pages";
import { team } from "@/content/team";
import { createPageMetadata } from "@/lib/metadata";
import { ctas } from "@/lib/site";
import { breadcrumbNode, webPageNode } from "@/lib/schema";

export const metadata = createPageMetadata({
  title: pages.team.title,
  description: pages.team.description,
  path: pages.team.path,
});

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageNode({
            name: pages.team.title,
            description: pages.team.description,
            path: pages.team.path,
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Team", path: pages.team.path },
          ]),
        ]}
      />

      <PageHero
        eyebrow="The team"
        title="A small team that owns the work."
        body="Search, marketing, and delivery stay with the people who actually run them. You work with operators — not a long roster of invented specialists."
        visual={<TeamHeroVisual />}
        primaryCta={ctas.primary}
        secondaryCta={{ label: "About DMrush", href: "/about" }}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <li
                key={member.slug}
                className="overflow-hidden rounded-[1.5rem] border border-line bg-cream shadow-sm"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-panel">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-2xl font-bold text-on-accent">
                      {initials(member.name)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-ink">{member.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-accent">{member.role}</p>
                  {member.expertise ? (
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-muted">
                      {member.expertise}
                    </p>
                  ) : null}
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-6 text-muted">{member.bio}</p>
                  ) : null}
                  <TeamSocialLinks social={member.social} />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-panel tx-arabic py-16 md:py-20">
        <Container className="mx-auto max-w-3xl text-center">
          <h2 className="t-h2 text-ink">Want to work with this team?</h2>
          <p className="t-body mx-auto mt-5 max-w-2xl text-muted">
            Book a strategy call to talk through search, web, and growth.
          </p>
          <div className="mt-8">
            <Button href={ctas.primary.href} variant="signal" size="lg">
              {ctas.primary.label} →
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
