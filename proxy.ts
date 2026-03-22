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
  "/doctor/login",
  "/doctor/register",
  "/patient/login",
  "/patient/register",
  "/hospital/login",
  "/hospital/register",
  "/admin/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/booking/confirmation",
];

const publicPathnameRegex = new RegExp(
  `^(${PUBLIC_ROUTES.map((p) => p.replace(/\//g, "\\/")).join("|")})(/.*)?$`,
  "i",
);

// Public profile pages: /doctor/[numeric-id] and /hospital/[numeric-id]
const publicProfileRegex = /^\/(doctor|hospital)\/\d+(\/.*)?$/i;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getAccessToken();

  const isPublicPage =
    publicPathnameRegex.test(pathname) ||
    publicProfileRegex.test(pathname);

  if (!isPublicPage && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return I18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
