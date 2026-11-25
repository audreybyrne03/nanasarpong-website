import Link from "next/link";

import { NAV_ITEMS, socialLabel } from "@/lib/site";
import type { Profile, SiteSettings } from "@/sanity/lib/types";

import { SmartLink } from "./SmartLink";

export function SiteFooter({ settings, profile, booking }: { settings: SiteSettings; profile: Profile; booking: { href: string; label: string } }) {
  const year = new Date().getFullYear();
  const links = settings.socialLinks ?? [];
  return (
    <footer className="border-t border-ink-line bg-ink text-paper-text">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl text-paper">
              {profile.name}
              {profile.credentials && <span className="ml-2 align-middle font-sans text-xs font-medium tracking-[0.12em] text-copper-light">{profile.credentials}</span>}
            </p>
            {settings.footerNote && <p className="mt-3 max-w-[40ch] text-paper-text/75">{settings.footerNote}</p>}
            <p className="mt-6">
              <SmartLink href={booking.href} className="btn btn-copper">{booking.label}</SmartLink>
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow text-copper-light">Explore</p>
            <ul className="mt-4 space-y-2">
              {[...NAV_ITEMS, { href: "/appointments", label: "Appointments" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper-text/80 hover:text-paper">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {links.length > 0 && (
            <div className="md:col-span-4">
              <p className="eyebrow text-copper-light">Profiles</p>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.url}>
                    <SmartLink href={link.url} className="text-paper-text/80 hover:text-paper">{socialLabel(link)}</SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {settings.medicalDisclaimer && (
          <p className="mt-14 max-w-[90ch] border-t border-ink-line pt-6 text-sm leading-relaxed text-paper-text/60">{settings.medicalDisclaimer}</p>
        )}
        <p className="mt-4 text-sm text-paper-text/50">© {year} {profile.name}{profile.credentials ? `, ${profile.credentials}` : ""}</p>
      </div>
    </footer>
  );
}
