// middleware.ts
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
})
  
// Define public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/about',
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Run i18n first
  const response = await I18nMiddleware(req);
  if (!response) return NextResponse.next();

  const pathname = req.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected route check
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // No token → redirect to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Verify token
  try {
    const payload = verifyToken(token); // decode & validate token
    // Optional: attach user info to headers for server actions/layout
    req.headers.set('x-user-type', payload.userType);
    req.headers.set('x-user-role', payload.roles[0]?.roleName || '');
    return NextResponse.next();
  } catch (err) {
    // Invalid token → redirect to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
};