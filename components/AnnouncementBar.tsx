import { isActiveWindow } from "@/lib/site";
import type { Announcement } from "@/sanity/lib/types";

import { SmartLink } from "./SmartLink";

/** Thin banner above the header, shown only inside its date window. */
export function AnnouncementBar({ announcement }: { announcement?: Announcement | null }) {
  if (!announcement?.enabled || !announcement.text) return null;
  if (!isActiveWindow(announcement.showFrom, announcement.showUntil)) return null;
  return (
    <div className="bg-copper text-white">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-center text-sm md:px-10">
        <span>{announcement.text}</span>
        {announcement.link?.url && (
          <SmartLink href={announcement.link.url} className="font-medium underline underline-offset-4 hover:no-underline">
            {announcement.link.label || "Learn more"} <span aria-hidden>→</span>
          </SmartLink>
        )}
      </p>
    </div>
  );
}
