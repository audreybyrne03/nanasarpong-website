import { getCardSettings, OG_CONTENT_TYPE, OG_SIZE, renderCard } from "@/lib/og";
import { seedProcedures } from "@/content/seed";
import { fetchPublished } from "@/sanity/lib/published";
import { PROCEDURE_QUERY } from "@/sanity/lib/queries";
import type { Procedure } from "@/sanity/lib/types";

export const alt = "Procedure";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ byline }, fetched] = await Promise.all([
    getCardSettings(),
    fetchPublished<Procedure>(PROCEDURE_QUERY, { slug }, ["procedure"]),
  ]);
  const procedure = fetched ?? seedProcedures.find((p) => p.slug === slug);
  return renderCard({
    kind: "Hip & Knee Care",
    title: procedure?.title || "Hip & Knee Care",
    meta: procedure?.summary,
    byline,
    customImage: procedure?.seo?.ogImage,
  });
}
