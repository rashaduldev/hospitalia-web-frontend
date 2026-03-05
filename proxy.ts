import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "fr"];
const DEFAULT_LOCALE = "en";

const I18nMiddleware = createI18nMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  urlMappingStrategy: "rewrite",
});

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/patient/login",
  "/patient/register",
  "/register",
  "/forgot-password",
];
const publicPathnameRegex = new RegExp(
  `^(/(${LOCALES.join("|")}))?(${PUBLIC_ROUTES.flatMap((p) =>
    p === "/" ? ["", "/"] : p,
  )
    .join("|")
    .replace(/\//g, "\\/")})\\/?$`,
  "i",
);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPage = publicPathnameRegex.test(pathname);
  const i18nResponse = I18nMiddleware(req);
  if (isPublicPage) {
    return i18nResponse;
  }
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
