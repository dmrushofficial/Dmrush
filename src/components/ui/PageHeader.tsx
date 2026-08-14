import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";

type PageHeaderProps = {
  title: string;
  description: string;
  crumbs: BreadcrumbItem[];
};

export function PageHeader({ title, description, crumbs }: PageHeaderProps) {
  return (
    <Section className="border-b border-line pb-12 pt-10 md:pb-16 md:pt-14" spacing="none">
      <Breadcrumb items={crumbs} />
      <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
        {description}
      </p>
    </Section>
  );
}
