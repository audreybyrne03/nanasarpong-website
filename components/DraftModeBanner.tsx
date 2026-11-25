"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Visible only in Draft Mode, outside the Studio's Presentation iframe. */
export function DraftModeBanner() {
  const pathname = usePathname();
  const inIframe = useSyncExternalStore(
    subscribe,
    () => window.self !== window.top,
    () => false,
  );
  if (inIframe) return null;

  return (
    <div role="status" className="bg-copper-light text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2 text-sm md:px-10">
        <span>You’re viewing draft content.</span>
        <a href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`} className="font-medium underline underline-offset-4">
          Exit preview
        </a>
      </div>
    </div>
  );
}
