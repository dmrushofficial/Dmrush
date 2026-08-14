import { BrandStatement } from "@/components/home/BrandStatement";
import { CustomerJourney } from "@/components/home/CustomerJourney";
import { EcommerceFeature } from "@/components/home/EcommerceFeature";
import { ExpertiseStrip } from "@/components/home/ExpertiseStrip";
import { FinalCta } from "@/components/home/FinalCta";
import { GoogleAdsFeature } from "@/components/home/GoogleAdsFeature";
import { GrowthSystem } from "@/components/home/GrowthSystem";
import { HomeCaseStudies } from "@/components/home/HomeCaseStudies";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeTeam } from "@/components/home/HomeTeam";
import { LearnBand } from "@/components/home/LearnBand";
import { MidCta } from "@/components/home/MidCta";
import { SeoFeature } from "@/components/home/SeoFeature";
import { WebDevFeature } from "@/components/home/WebDevFeature";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { WhyDmrush } from "@/components/home/WhyDmrush";
import { JsonLd } from "@/components/seo/JsonLd";
import { pages } from "@/content/pages";
import { createPageMetadata } from "@/lib/metadata";
import { webPageNode } from "@/lib/schema";

export const metadata = createPageMetadata({
  title: pages.home.title,
  description: pages.home.description,
  path: pages.home.path,
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={webPageNode({
          name: pages.home.title,
          description: pages.home.description,
          path: pages.home.path,
        })}
      />
      <HomeHero />
      <ExpertiseStrip />
      <WhoWeAre />
      <CustomerJourney />
      <HomeServices />
      <BrandStatement />
      <SeoFeature />
      <WebDevFeature />
      <EcommerceFeature />
      <GoogleAdsFeature />
      <GrowthSystem />
      <HomeCaseStudies />
      <HomeTeam />
      <LearnBand />
      <WhyDmrush />
      <MidCta />
      <HomeProcess />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
