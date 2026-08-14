import { notFound } from "next/navigation";
import { AboutThisCourse } from "@/components/courses/AboutThisCourse";
import { BuildItSection } from "@/components/courses/BuildItSection";
import { CareerCards } from "@/components/courses/CareerCards";
import { CourseFinalCta } from "@/components/courses/CourseFinalCta";
import { CourseHero } from "@/components/courses/CourseHero";
import { CourseProject } from "@/components/courses/CourseProject";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { LearningMethodBand } from "@/components/courses/LearningMethodBand";
import { RelatedCourses } from "@/components/courses/RelatedCourses";
import { SkillsYoullBuild } from "@/components/courses/SkillsYoullBuild";
import { ToolsChips } from "@/components/courses/ToolsChips";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { courses, getCourseBySlug, getRelatedCourses } from "@/content/courses";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbNode, courseNode, faqPageNode } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return createPageMetadata({
    title: course.metaTitle.replace(/\s*\|\s*.*$/, "").trim() || course.title,
    description: course.metaDescription,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const related = getRelatedCourses(course).slice(0, 3);
  const faqItems = course.faq.slice(0, 8);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
            { name: course.title, path: `/courses/${course.slug}` },
          ]),
          courseNode(course),
          faqPageNode(faqItems),
        ]}
      />

      <CourseHero course={course} />
      <AboutThisCourse course={course} />
      <SkillsYoullBuild skills={course.skills} />
      <CurriculumAccordion periods={course.curriculum} />
      <BuildItSection course={course} />
      <CourseProject course={course} />
      <ToolsChips tools={course.tools} />
      <CareerCards roles={course.careerOpportunities} />
      <LearningMethodBand />

      <section className="bg-surface py-12 md:py-16">
        <Container className="max-w-3xl">
          <Faq title="FAQ" items={faqItems} headingId="course-faq" />
        </Container>
      </section>

      <RelatedCourses courses={related} />
      <CourseFinalCta course={course} />
    </>
  );
}
