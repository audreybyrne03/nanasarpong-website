import type { Metadata } from "next";

import { getSettings } from "@/sanity/lib/data";
import type { PageKey } from "@/sanity/lib/types";

import { pageMetadata } from "./metadata";
import { clean, DEFAULT_SITE_TITLE } from "./site";

/** generateMetadata for a section landing page, driven by Site settings → Page intros. */
export function sectionMetadata(key: PageKey, fallbackTitle: string, path: string) {
  return async (): Promise<Metadata> => {
    const settings = await getSettings();
    return pageMetadata({
      page: settings[key],
      fallbackTitle,
      siteTitle: clean(settings.title) || DEFAULT_SITE_TITLE,
      siteDescription: settings.description,
      path,
    });
  };
}
