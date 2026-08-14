import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { team } from "@/content/team";
import { homeCopy } from "@/content/home";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function HomeTeam() {
  const { team: copy } = homeCopy;

  return (
    <section className="bg-surface py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-label text-accent">{copy.eyebrow}</p>
            <h2 className="t-h2 mt-4 text-ink">{copy.title}</h2>
          </div>
          <Link href={copy.href as Route} className="text-sm font-bold text-ink hover:text-accent">
            View full team →
          </Link>
        </div>
        {team.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-cream px-6 py-12 text-center">
            <p className="mx-auto max-w-xl text-base leading-7 text-muted">{copy.empty}</p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member) => (
              <li
                key={member.slug}
                className="overflow-hidden rounded-2xl border border-line bg-cream"
              >
                <div className="relative flex aspect-[3/4] items-center justify-center bg-panel">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 240px, 45vw"
                    />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-xl font-bold text-on-accent">
                      {initials(member.name)}
                    </span>
                  )}
                </div>
                <div className="px-4 py-4">
                  <p className="font-bold text-ink">{member.name}</p>
                  <p className="mt-1 text-sm text-accent">{member.role}</p>
                  {member.expertise ? (
                    <p className="mt-2 text-sm text-muted">{member.expertise}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
