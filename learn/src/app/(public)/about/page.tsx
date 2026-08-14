import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "About DMrush Institute — live physical classes for practical digital skills in SEO, AI, web building, and ecommerce.",
  path: "/about",
});

const pillars = [
  {
    title: "Live physical classes",
    body: "Learning happens in person. The platform supports notes, assignments, attendance, and certificates — not recorded video lectures.",
  },
  {
    title: "Assignments & feedback",
    body: "Students practice with real-world style tasks and receive structured instructor feedback.",
  },
  {
    title: "Progress visibility",
    body: "Dashboards track notes, assignments, attendance, grades, and certificate readiness.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-cream tx-paper">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="t-label text-accent">About DMrush Learn</p>
            <h1 className="t-h2 mt-4 max-w-4xl text-ink">
              An institute for practical digital growth skills.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
              DMrush Learn is the education brand of DMrush — focused on teaching the systems
              behind search, AI workflows, websites, ecommerce, and digital marketing through live
              physical classes.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line shadow-sm">
            <Image
              src="/images/home/about-classroom.png"
              alt="DMrush Learn classroom prepared for a digital skills workshop"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </Container>
      </section>
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {pillars.map((item, index) => (
              <li key={item.title} className="rounded-2xl border border-line bg-cream p-6">
                <p className="text-sm font-bold text-accent">0{index + 1}</p>
                <h2 className="mt-3 text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-line bg-panel">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-56">
                <Image
                  src="/images/home/notes-learning.png"
                  alt="Notes and learning materials"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-ink">Connected to DMrush Agency</h2>
                <p className="mt-3 max-w-2xl text-muted">
                  Learn sits alongside the agency practice. Training stays practical. Agency work
                  stays client-facing. Visit the agency site anytime.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href="/courses" variant="signal">
                    Explore Courses
                  </Button>
                  <Button href={siteConfig.agencyUrl} variant="secondary">
                    Visit {siteConfig.agencyLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-muted">
            Demo dashboards:{" "}
            <Link href="/student/dashboard" className="font-semibold text-accent hover:underline">
              Student
            </Link>{" "}
            ·{" "}
            <Link href="/teacher/dashboard" className="font-semibold text-accent hover:underline">
              Teacher
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
