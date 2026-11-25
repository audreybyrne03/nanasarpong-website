import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

/**
 * Called by the Studio's Presentation tool. It validates a short-lived,
 * Sanity-issued preview secret before enabling Draft Mode, so preview
 * links can't be forged.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});
