import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  // Only redirect to same-origin paths to avoid open redirects.
  const next = request.nextUrl.searchParams.get("redirect");
  const path = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return NextResponse.redirect(new URL(path, request.url));
}
