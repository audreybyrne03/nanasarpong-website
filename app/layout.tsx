// Self-hosted variable fonts (no runtime request to Google Fonts).
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0e1a2b",
};

/**
 * Root layout shared by the public site (app/(site)) and the embedded
 * Studio (app/studio). Site chrome and metadata live in app/(site)/layout.tsx.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
