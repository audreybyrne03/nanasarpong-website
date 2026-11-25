import { clean } from "@/lib/site";
import { getCardSettings, OG_CONTENT_TYPE, OG_SIZE, renderCard } from "@/lib/og";

export const alt = "Dr. Nana O. Sarpong — website preview";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Homepage card; also the fallback for any page without its own. */
export default async function Image() {
  const { settings, siteTitle, byline } = await getCardSettings();
  const title = clean(settings?.shareCard?.homeTitle) || siteTitle;
  return renderCard({
    title,
    meta: clean(settings?.shareCard?.homeSubtitle) || clean(settings?.tagline),
    byline: title === byline ? "" : byline,
    customImage: settings?.ogImage,
  });
}
