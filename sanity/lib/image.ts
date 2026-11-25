import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "../env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId: projectId || "unconfigured", dataset });

export function urlFor(source: SanityImage) {
  return builder.image(source).auto("format").fit("max");
}

/** True when an image field actually has an uploaded asset. */
export function hasImage(image?: SanityImage | null): image is SanityImage {
  return Boolean(image?.asset?._ref || image?.asset?._id);
}
