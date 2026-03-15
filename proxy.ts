import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./actions/auth";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

const PUBLIC_ROUTES = [
  "/",
  "/search",
  "/login",
  "/doctor",
  "/patient/login",
  "/patient/register",
  "/register",
  "/hospital",
  "/forgot-password",
  "/verify-otp",
];

const publicPathnameRegex = new RegExp(
  `^(${PUBLIC_ROUTES.map((p) => p.replace(/\//g, "\\/")).join("|")})(/.*)?$`,
  "i",
);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getAccessToken();

  const isPublicPage = publicPathnameRegex.test(pathname);
  if (!isPublicPage && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return I18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
