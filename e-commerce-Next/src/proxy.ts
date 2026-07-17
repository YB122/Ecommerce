import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const HEADER_LOCALE_NAME = "X-NEXT-INTL-LOCALE";
const COOKIE_LOCALE_NAME = "NEXT_LOCALE";

function negotiateLocale(request: NextRequest): string {
  const cookie = request.cookies.get(COOKIE_LOCALE_NAME)?.value;
  if (cookie && routing.locales.includes(cookie as "en" | "fr" | "ar")) return cookie;

  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const parsed = acceptLang.split(",").map((l) => l.split(";")[0].trim().split("-")[0]);
    for (const lang of parsed) {
      if (routing.locales.includes(lang as "en" | "fr" | "ar")) return lang;
    }
  }

  return routing.defaultLocale;
}

export function proxy(request: NextRequest) {
  const locale = negotiateLocale(request);
  const response = NextResponse.next();

  response.headers.set(HEADER_LOCALE_NAME, locale);

  const existingCookie = request.cookies.get(COOKIE_LOCALE_NAME)?.value;
  if (existingCookie !== locale) {
    response.cookies.set(COOKIE_LOCALE_NAME, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_verver|.*\\..*).*)"],
};
