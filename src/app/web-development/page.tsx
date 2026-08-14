import { ServiceLandingPage } from "@/components/page/ServiceLandingPage";
import { getServiceLanding } from "@/content/service-landings";
import { getService } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";

const slug = "web-development" as const;
const service = getService(slug);
const landing = getServiceLanding(slug);

export const metadata = createPageMetadata({
  title: landing.metaTitle,
  description: service.description,
  path: service.href,
});

export default function Page() {
  return <ServiceLandingPage slug={slug} />;
}
