"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { NAV_ITEMS } from "@/lib/site";

import { SmartLink } from "./SmartLink";

interface Props {
  name: string;
  credentials?: string | null;
  booking: { href: string; label: string };
}

export function SiteHeader({ name, credentials, booking }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative z-30 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link href="/" className="group leading-none" aria-current={pathname === "/" ? "page" : undefined}>
          <span className="font-serif text-[1.6rem] tracking-[-0.01em] transition-colors group-hover:text-copper-light">{name}</span>
          {credentials && <span className="ml-2 text-xs font-medium tracking-[0.12em] text-copper-light">{credentials}</span>}
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-[0.9375rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative py-1 text-paper-text/80 transition-colors hover:text-paper aria-[current=page]:text-paper after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-copper after:transition-transform after:duration-300 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <SmartLink href={booking.href} className="btn btn-copper hidden !py-2.5 sm:inline-flex">
            {booking.label}
          </SmartLink>
          <button
            ref={buttonRef}
            type="button"
            className="-mr-2 inline-flex items-center gap-2 rounded px-2 py-1.5 text-[0.9375rem] text-paper-text xl:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-copper transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-copper transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Main" hidden={!open} className="border-t border-ink-line xl:hidden">
        <ul className="mx-auto max-w-6xl px-6 py-4 md:px-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block py-2.5 font-serif text-2xl text-paper-text/85 hover:text-paper aria-[current=page]:text-copper-light"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-4 sm:hidden">
            <SmartLink href={booking.href} className="btn btn-copper">
              {booking.label}
            </SmartLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
