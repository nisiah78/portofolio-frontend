import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

/** Redirect any non-locale-prefixed path to the default locale. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API, Next internals, and any file with an extension (images, CV, favicon).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
