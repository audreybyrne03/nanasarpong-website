import type { Metadata } from "next";

import type { PageIntro, Seo } from "@/sanity/lib/types";

import { clean } from "./site";

/**
 * Shared OpenGraph / Twitter fields.
 * Preview images come from the opengraph-image.tsx files (branded cards, or an
 * editor-uploaded image when one is set in Sanity), so none are set here.
 */
export function buildMetadata({
  siteTitle,
  title,
  description,
  type = "website",
  path,
}: {
  siteTitle: string;
  title?: string | null;
  description?: string | null;
  type?: "website" | "article";
  path?: string;
}): Metadata {
  const desc = clean(description) || undefined;
  return {
    description: desc,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      type,
      siteName: siteTitle,
      title: clean(title) || siteTitle,
      description: desc,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: clean(title) || siteTitle,
      description: desc,
    },
  };
}

/** Metadata for a section landing page driven by a Site settings page intro. */
export function pageMetadata({
  page,
  fallbackTitle,
  siteTitle,
  siteDescription,
  path,
}: {
  page?: PageIntro | null;
  fallbackTitle: string;
  siteTitle: string;
  siteDescription?: string | null;
  path: string;
}): Metadata {
  const seo: Seo | null | undefined = page?.seo;
  const title = clean(seo?.metaTitle) || clean(page?.title) || fallbackTitle;
  return {
    title,
    ...buildMetadata({
      siteTitle,
      title,
      description: seo?.metaDescription || siteDescription,
      path,
    }),
    ...(seo?.noIndex ? { robots: { index: false } } : {}),
  };
}
