import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  urlMappingStrategy:"rewrite",
});

// Public routes
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const purePathname = removeLocale(pathname);

  const i18nResponse = I18nMiddleware(req);

  // Public Route Logic
  const isPublic = PUBLIC_ROUTES.some((route) => {
    if (route === "/") return purePathname === "/";
    return purePathname.startsWith(route);
  });

  if (isPublic) {
    return i18nResponse;
  }

  // Protected Route Logic
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/doctor/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = decodeJwt(token);
    const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;

    if (isExpired) {
       throw new Error("Token expired");
    }
    return i18nResponse;
  } catch (err) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/doctor/login`, req.url);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};