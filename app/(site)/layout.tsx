import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { DraftModeBanner } from "@/components/DraftModeBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { bookingLink } from "@/lib/booking";
import { buildMetadata } from "@/lib/metadata";
import { clean, DEFAULT_SITE_TITLE, getSiteUrl, isProductionDeployment } from "@/lib/site";
import { getProfile, getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = clean(settings.title) || DEFAULT_SITE_TITLE;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: title, template: `%s | ${title}` },
    applicationName: title,
    ...buildMetadata({ siteTitle: title, description: settings.description }),
    ...(isProductionDeployment() ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, profile, { isEnabled: isDraftMode }] = await Promise.all([getSettings(), getProfile(), draftMode()]);
  const booking = bookingLink(settings);

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-copper-light px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {isDraftMode && <DraftModeBanner />}
      <AnnouncementBar announcement={settings.announcement} />
      <SiteHeader name={profile.name ? `Dr. ${profile.name.replace(/^Dr\.?\s*/i, "")}` : DEFAULT_SITE_TITLE} credentials={null} booking={booking} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} profile={profile} booking={booking} />
      {isDraftMode && <VisualEditing />}
    </>
  );
}
