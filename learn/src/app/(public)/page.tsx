import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/public/CourseCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  courseJourney,
  homeFaq,
  learningExperience,
  whyLearn,
} from "@/content/home";
import { instructors } from "@/content/instructors";
import { courses, skillStrip } from "@/content/courses";
import {
  mockStudent,
  studentAnnouncements,
  studentAssignments,
} from "@/content/student";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const enrolled = courses.filter((c) => c.enrollmentState === "enrolled");
  const upcoming = studentAssignments.filter(
    (a) => a.status === "upcoming" || a.status === "submitted",
  );

  return (
    <>
      <section className="border-b border-line bg-cream tx-paper">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="t-label text-accent">DMrush Institute</p>
            <h1 className="t-hero mt-4 text-ink">
              Learn the skills businesses are hiring for.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">
              Practical, career-focused training in SEO, AI, web building, digital marketing,
              and ecommerce — through live physical classes, with online notes, assignments,
              and progress tracking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/courses" variant="signal" size="lg">
                Explore Courses →
              </Button>
              <Button href="/login" variant="secondary" size="lg">
                Student Login
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["SEO", "AI", "Web", "Ecommerce", "Link Building"].map((item) => (
                <Badge key={item} tone="neutral">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line shadow-sm lg:aspect-[5/4]">
            <Image
              src="/images/home/hero-institute.png"
              alt="DMrush Learn live classroom and digital skills workshop"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-surface">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
          {skillStrip.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/65"
            >
              {skill}
            </span>
          ))}
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="t-label text-accent">Featured courses</p>
              <h2 className="t-h2 mt-4 text-ink">Six practical programs. One institute.</h2>
            </div>
            <Button href="/courses" variant="secondary">
              View all courses
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line">
            <Image
              src="/images/home/notes-learning.png"
              alt="Class notes and learning materials on a desk"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <div>
            <p className="t-label text-accent">Why Learn with DMrush</p>
            <h2 className="t-h2 mt-4 text-ink">Built for practical digital skill-building.</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyLearn.map((item) => (
                <li key={item.title} className="rounded-2xl border border-line bg-cream p-5">
                  <h3 className="text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-panel tx-paper py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="t-label text-accent">Learning experience</p>
            <h2 className="t-h2 mt-4 text-ink">How the platform works.</h2>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {learningExperience.map((item) => (
              <li key={item.step} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm font-bold text-signal">{item.step}</p>
                <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="t-label text-accent">Student dashboard preview</p>
              <h2 className="t-h2 mt-4 text-ink">A clear view of learning progress.</h2>
              <p className="mt-4 text-muted">
                Mock preview for {mockStudent.name}. Full interactive screens live under Student
                routes.
              </p>
            </div>
            <Button href="/student/dashboard" variant="secondary">
              Open student demo
            </Button>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 rounded-2xl border border-line bg-cream p-5 lg:col-span-2">
              <h3 className="font-bold text-ink">Continue learning</h3>
              {enrolled.map((course) => (
                <div
                  key={course.id}
                  className="flex gap-4 rounded-xl border border-line bg-surface p-3"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-panel">
                    <Image
                      src={course.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{course.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          Live classes · notes & assignments
                        </p>
                      </div>
                      <Badge>{course.progress}%</Badge>
                    </div>
                    <ProgressBar value={course.progress} className="mt-3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-cream p-5">
                <h3 className="font-bold text-ink">Upcoming assignments</h3>
                <ul className="mt-4 space-y-3">
                  {upcoming.slice(0, 3).map((item) => (
                    <li key={item.id} className="text-sm">
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-muted">
                        {item.courseTitle} · Due {item.dueDate}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-cream p-5">
                <h3 className="font-bold text-ink">Announcements</h3>
                <ul className="mt-4 space-y-3">
                  {studentAnnouncements.slice(0, 2).map((item) => (
                    <li key={item.id} className="text-sm">
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-muted">{item.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="t-label text-accent">Instructors</p>
            <h2 className="t-h2 mt-4 text-ink">Instructor profiles coming soon.</h2>
            <p className="mt-4 text-muted">
              Placeholder cards are ready. Real names and photos will be added when provided.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((person) => (
              <li key={person.id} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-panel text-sm font-bold text-accent">
                  TBA
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{person.name}</h3>
                <p className="mt-1 text-sm font-semibold text-accent">{person.role}</p>
                <p className="mt-3 text-sm text-muted">{person.courseTaught}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-muted">
                  {person.expertise}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="t-label text-accent">Course journey</p>
            <h2 className="t-h2 mt-4 text-ink">From enrollment to certificate.</h2>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {courseJourney.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-line bg-cream p-5">
                  <p className="text-sm font-bold text-signal">Step {index + 1}</p>
                  <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line">
            <Image
              src="/images/home/certificate-still.png"
              alt="Certificate completion still life"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container className="max-w-3xl">
          <Faq title="Frequently asked questions" items={homeFaq} />
        </Container>
      </section>

      <section className="bg-accent tx-paper py-16 md:py-20">
        <Container className="mx-auto max-w-3xl text-center">
          <h2 className="t-h2 text-on-accent">Start building practical digital skills.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-on-accent/75">
            Explore the course catalog or contact DMrush Learn for admission questions.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/courses" variant="signal" size="lg">
              Explore Courses →
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="border-white/30 text-on-accent hover:bg-white/10"
            >
              Contact DMrush Learn
            </Button>
          </div>
          <p className="mt-6 text-sm text-on-accent/55">
            Agency site:{" "}
            <Link href={siteConfig.agencyUrl} className="underline hover:text-signal">
              {siteConfig.agencyUrl.replace("https://", "")}
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
