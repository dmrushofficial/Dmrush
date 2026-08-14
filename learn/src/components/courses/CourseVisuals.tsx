import Image from "next/image";

export type CourseVisualTheme =
  | "local-seo"
  | "global-seo"
  | "ai-tools"
  | "saas-ai"
  | "ai-website"
  | "wordpress"
  | "shopify"
  | "digital-marketing";

const heroImages: Record<CourseVisualTheme, { src: string; alt: string }> = {
  "local-seo": {
    src: "/images/courses/visuals/local-seo-hero.jpg",
    alt: "Local SEO — maps, rankings, and business profile on a modern desk",
  },
  "global-seo": {
    src: "/images/courses/visuals/global-seo-hero.jpg",
    alt: "Global SEO — search rankings and analytics dashboards",
  },
  "ai-tools": {
    src: "/images/courses/visuals/ai-tools-hero.jpg",
    alt: "AI Tools — prompt to AI to output workflow",
  },
  "saas-ai": {
    src: "/images/courses/visuals/saas-ai-hero.jpg",
    alt: "SaaS AI — connected apps and automation workflows",
  },
  "ai-website": {
    src: "/images/courses/visuals/ai-website-hero.jpg",
    alt: "AI Website Building — prompt generating a website",
  },
  wordpress: {
    src: "/images/courses/visuals/wordpress-hero.jpg",
    alt: "WordPress — website builder with desktop and mobile previews",
  },
  shopify: {
    src: "/images/courses/visuals/shopify-hero.jpg",
    alt: "Shopify — online store, products, and orders",
  },
  "digital-marketing": {
    src: "/images/courses/visuals/digital-marketing-hero.jpg",
    alt: "Digital Marketing — campaigns, ads, and analytics",
  },
};

const practiceImages: Record<CourseVisualTheme, { src: string; alt: string }> = {
  "local-seo": {
    src: "/images/courses/visuals/local-seo-practice.jpg",
    alt: "Local SEO practice workspace with maps and business reports",
  },
  "global-seo": {
    src: "/images/courses/visuals/global-seo-practice.jpg",
    alt: "SEO audit practice with analytics screens",
  },
  "ai-tools": {
    src: "/images/courses/visuals/ai-tools-practice.jpg",
    alt: "AI prompt engineering practice desk",
  },
  "saas-ai": {
    src: "/images/courses/visuals/saas-ai-practice.jpg",
    alt: "SaaS automation workflow practice",
  },
  "ai-website": {
    src: "/images/courses/visuals/ai-website-practice.jpg",
    alt: "AI website building practice with wireframes",
  },
  wordpress: {
    src: "/images/courses/visuals/wordpress-practice.jpg",
    alt: "WordPress website building practice",
  },
  shopify: {
    src: "/images/courses/visuals/shopify-practice.jpg",
    alt: "Shopify store building practice with products",
  },
  "digital-marketing": {
    src: "/images/courses/visuals/digital-marketing-practice.jpg",
    alt: "Digital marketing campaign planning workspace",
  },
};

export function CourseVisual({
  theme,
  variant = "hero",
  className,
  priority = false,
}: {
  theme: CourseVisualTheme;
  variant?: "hero" | "practice";
  className?: string;
  priority?: boolean;
}) {
  const asset = variant === "practice" ? practiceImages[theme] : heroImages[theme];

  return (
    <div className={className ?? "relative aspect-[4/3] w-full overflow-hidden"}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 40vw, 100vw"
        priority={priority}
      />
    </div>
  );
}
