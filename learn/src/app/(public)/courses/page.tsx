import { CourseCard } from "@/components/public/CourseCard";
import { Container } from "@/components/ui/Container";
import { courses } from "@/content/courses";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Courses",
  description:
    "Browse six DMRUSH Learn courses in Pattoki: Global SEO, Local SEO, AI Website Building, AI Tools & Prompt Engineering, Guest Posting & Link Building, and Shopify & E-commerce — with schedules and project-based curricula.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <section className="border-b border-line bg-cream tx-paper">
        <Container className="py-14 lg:py-20">
          <p className="t-label text-accent">Course catalog</p>
          <h1 className="t-h2 mt-4 max-w-3xl text-ink">
            Practical programs for digital growth skills.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
            Six current courses at DMRUSH. Live physical classes with detailed curricula, projects,
            and portfolio-focused training — each with a clear duration, weekly schedule, and class
            time.
          </p>
        </Container>
      </section>
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
