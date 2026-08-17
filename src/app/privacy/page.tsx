import { LegalDocument } from "@/components/page/LegalDocument";
import { legalPages } from "@/content/legal";
import { createPageMetadata } from "@/lib/metadata";

const document = legalPages.privacy;

export const metadata = createPageMetadata({
  title: document.title,
  description: document.description,
  path: document.path,
});

export default function PrivacyPage() {
  return <LegalDocument document={document} />;
}
