import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { toPlainText } from "next-sanity";
import { ImageResponse } from "next/og";

import { hasImage, urlFor } from "@/sanity/lib/image";
import { fetchPublished } from "@/sanity/lib/published";
import { SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { PageKey, SanityImage, SiteSettings } from "@/sanity/lib/types";

import { seedSettings } from "@/content/seed";

import { clean, DEFAULT_SITE_TITLE } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const C = {
  ink: "#0e1a2b",
  line: "#2a3d57",
  ivory: "#f6f2eb",
  ivoryText: "#e9e2d4",
  gold: "#b06a35",
  goldLight: "#dea87b",
};

async function loadFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [serif, serifItalic, sans, sansMedium] = await Promise.all([
    readFile(join(dir, "instrument-serif-latin-400-normal.woff")),
    readFile(join(dir, "instrument-serif-latin-400-italic.woff")),
    readFile(join(dir, "hanken-grotesk-latin-400-normal.woff")),
    readFile(join(dir, "hanken-grotesk-latin-500-normal.woff")),
  ]);
  return [
    { name: "Serif", data: serif, weight: 300 as const, style: "normal" as const },
    { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Sans", data: sansMedium, weight: 500 as const, style: "normal" as const },
  ];
}

/** Site-wide values for cards, fetched once per image. */
export async function getCardSettings() {
  const settings = (await fetchPublished<SiteSettings>(SETTINGS_QUERY, {}, ["siteSettings"])) ?? seedSettings;
  const siteTitle = clean(settings?.title) || DEFAULT_SITE_TITLE;
  return {
    settings,
    siteTitle,
    byline: clean(settings?.shareCard?.byline) || siteTitle,
  };
}

function siteDomain(): string | null {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function titleSize(title: string): number {
  const n = title.length;
  if (n <= 32) return 84;
  if (n <= 60) return 70;
  if (n <= 95) return 58;
  return 50;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

interface CardOptions {
  /** Small label above the title: the section, e.g. "Journal". */
  kind?: string | null;
  title: string;
  /** One line under the title, e.g. a date or "Journal of …, 2026". */
  meta?: string | null;
  byline: string;
  /** If set, this editor-uploaded image replaces the generated card. */
  customImage?: SanityImage | null;
}

/** Branded 1200×630 link-preview image in the site's navy, ivory and gold. */
export async function renderCard({ kind, title, meta, byline, customImage }: CardOptions) {
  if (hasImage(customImage)) {
    const src = urlFor(customImage).width(1200).height(630).fit("crop").format("png").url();
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} width={1200} height={630} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ),
      { ...OG_SIZE },
    );
  }

  const fonts = await loadFonts();
  const cleanTitle = truncate(clean(title) || byline, 140);
  const domain = siteDomain();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.ink,
          color: C.ivory,
          padding: "72px 88px 64px 80px",
          fontFamily: "Sans",
        }}
      >
        {/* Meridian: gold rule with a ring at the top, as on the homepage */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, marginRight: 52 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${C.gold}` }} />
          <div
            style={{
              width: 2,
              flexGrow: 1,
              backgroundImage: `linear-gradient(to bottom, ${C.gold}, rgba(176,106,53,0.15))`,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
          {kind && (
            <div style={{ fontSize: 26, fontWeight: 500, color: C.goldLight, marginTop: -4, letterSpacing: 0.2 }}>{kind}</div>
          )}

          <div
            style={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              fontFamily: "Serif",
              fontWeight: 300,
              fontSize: Math.round(titleSize(cleanTitle) * 1.12),
              lineHeight: 1.08,
              letterSpacing: -1.2,
              color: C.ivory,
              paddingRight: 24,
            }}
          >
            {cleanTitle}
          </div>

          {meta && (
            <div
              style={{
                fontFamily: "Serif",
                fontStyle: "italic",
                fontSize: 30,
                color: C.ivoryText,
                opacity: 0.85,
                marginBottom: 36,
              }}
            >
              {truncate(clean(meta), 90)}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: `1px solid ${C.line}`,
              paddingTop: 24,
            }}
          >
            <div style={{ fontFamily: "Serif", fontSize: 30, color: C.ivory }}>{truncate(byline, 60)}</div>
            {domain && <div style={{ fontSize: 22, color: C.goldLight }}>{domain}</div>}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

/** Card for a section landing page (About, Research, …) using its Site settings intro. */
export async function renderSectionCard(
  key: PageKey,
  fallbackTitle: string,
) {
  const { settings, byline } = await getCardSettings();
  const page = settings?.[key];
  const heading = clean(page?.title) || fallbackTitle;
  // Use the first sentence of the page intro as the card's headline, if there is one.
  const rawIntro = page?.intro;
  const intro = !rawIntro?.length ? "" : typeof rawIntro === "string" ? clean(rawIntro).trim() : clean(toPlainText(rawIntro)).trim();
  const firstSentence = intro.match(/^.{20,140}?[.!?](\s|$)/)?.[0]?.trim() || (intro.length <= 140 ? intro : "");
  return renderCard({
    kind: firstSentence ? heading : null,
    title: firstSentence || heading,
    byline,
    customImage: page?.seo?.ogImage,
  });
}
