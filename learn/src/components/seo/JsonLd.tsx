import { jsonLdGraph, type JsonLdNode } from "@/lib/schema";

export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const payload = Array.isArray(data)
    ? jsonLdGraph(data)
    : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
