export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  services: string[];
  href: string;
  image?: string;
  industry?: string;
  challenge?: string;
  result?: string;
};

export const caseStudies: CaseStudy[] = [];
