import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
});

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/doctor/login",
  "/doctor/registration",
  "/forgot-password",
  "/about",
];

function removeLocale(pathname: string) {
  return pathname.replace(/^\/(en|fr)/, "") || "/";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const purePath = removeLocale(pathname);

  const i18nResponse = I18nMiddleware(req);

  const isPublic = PUBLIC_ROUTES.some((route) =>
    route === "/" ? purePath === "/" : purePath.startsWith(route)
  );

  if (isPublic) return i18nResponse;

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const locale = pathname.split("/")[1] || "en";
    return NextResponse.redirect(
      new URL(`/${locale}/doctor/login`, req.url)
    );
  }

  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};