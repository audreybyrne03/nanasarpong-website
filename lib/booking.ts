import type { SiteSettings } from "@/sanity/lib/types";

import { clean } from "./site";

/** Every "Request an appointment" button resolves through here. */
export function bookingLink(settings: SiteSettings | null | undefined) {
  const url = clean(settings?.appointments?.bookingUrl);
  return {
    href: url || "/appointments",
    label: settings?.appointments?.bookingLabel || "Request an appointment",
  };
}
