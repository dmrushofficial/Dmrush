import { jsonLdGraph, type JsonLdNode } from "@/lib/schema";

type JsonLdProps = {
  data: JsonLdNode | JsonLdNode[];
};

export function JsonLd({ data }: JsonLdProps) {
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
