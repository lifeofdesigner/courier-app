type SeoJsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function serializeJsonLd(data: SeoJsonLdProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function SeoJsonLd({ data }: SeoJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
