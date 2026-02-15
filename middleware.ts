// import { createI18nMiddleware } from 'next-international/middleware'
// import { NextRequest } from 'next/server'
 
// const I18nMiddleware = createI18nMiddleware({
//   locales: ['en', 'fr'],
//   defaultLocale: 'fr'
// })
 
// export function middleware(request: NextRequest) {
//   return I18nMiddleware(request)
// }
 
// export const config = {
//   matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
// }
// middleware.ts
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
});

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
  
  const response = await I18nMiddleware(req);
  if (!response) return NextResponse.next();

  const pathname = req.nextUrl.pathname;

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    const payload = verifyToken(token);
    req.headers.set('x-user-type', payload.userType);
    req.headers.set('x-user-role', payload.roles[0]?.roleName || '');
    return NextResponse.next();
  } catch (err) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
