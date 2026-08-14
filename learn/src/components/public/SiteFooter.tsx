import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { courses } from "@/content/courses";
import { publicNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-accent text-on-accent">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo showLearn onDark imageClassName="h-8 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-on-accent/75">
            {siteConfig.description}
          </p>
          <a
            href={siteConfig.agencyUrl}
            className="mt-5 inline-block text-sm font-semibold text-signal hover:underline"
          >
            Visit {siteConfig.agencyLabel} →
          </a>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-accent/55">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-signal">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="hover:text-signal">
                Student Login
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-on-accent/55">
            Programs
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.map((course) => (
              <li key={course.id}>
                <Link href={`/courses/${course.slug}`} className="hover:text-signal">
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-accent/55">
            Contact
          </p>
          <p className="mt-4 text-sm text-on-accent/80">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-signal">
              {siteConfig.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-on-accent/60">
            Dashboard demos:{" "}
            <Link href="/student/dashboard" className="underline hover:text-signal">
              Student
            </Link>{" "}
            ·{" "}
            <Link href="/teacher/dashboard" className="underline hover:text-signal">
              Teacher
            </Link>
          </p>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-on-accent/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.institute}. Frontend demo.</p>
          <p>Part of the DMrush ecosystem.</p>
        </Container>
      </div>
    </footer>
  );
}
