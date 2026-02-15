// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
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

// Remove locale prefix
function removeLocale(pathname: string) {
  return pathname.replace(/^\/(en|fr)/, "") || "/";
}

// Edge-compatible JWT verification
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface MyTokenPayload {
  roles?: { roleName: string }[];
  userType?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

async function verifyToken(token: string): Promise<MyTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as MyTokenPayload;
  } catch (err: any) {
    console.error("JWT verification failed:", err.message);
    throw new Error("Invalid token");
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Run i18n first
  const i18nResponse = await I18nMiddleware(req);

  const pathname = removeLocale(req.nextUrl.pathname);
  console.log("pathname:", pathname);

  // Check public routes
  const isPublic = PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });

  if (isPublic) return i18nResponse || NextResponse.next();

  // Protected routes
  const token = req.cookies.get("accessToken")?.value;
  console.log("Raw token:", token, "Length:", token?.length);

  if (!token) {
    url.pathname = "/doctor/login";
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyToken(token);
    console.log("JWT payload:", payload);

    const headers = new Headers(req.headers);
    headers.set("x-user-role", payload.roles?.[0]?.roleName || "");
    headers.set("x-user-type", payload.userType || "");

    return NextResponse.next({
      request: { headers },
    });
  } catch (err) {
    url.pathname = "/doctor/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
