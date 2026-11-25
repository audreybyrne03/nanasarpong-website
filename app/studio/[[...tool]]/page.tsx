/**
 * Embedded Sanity Studio. All routes under /studio are handled here.
 * Sign-in is handled by Sanity; only project members can edit content.
 */
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
