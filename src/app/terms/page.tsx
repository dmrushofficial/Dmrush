import { LegalDocument } from "@/components/page/LegalDocument";
import { legalPages } from "@/content/legal";
import { createPageMetadata } from "@/lib/metadata";

const document = legalPages.terms;

export const metadata = createPageMetadata({
  title: document.title,
  description: document.description,
  path: document.path,
});

export default function TermsPage() {
  return <LegalDocument document={document} />;
}
