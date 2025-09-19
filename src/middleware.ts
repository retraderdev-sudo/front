import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'fa'];
const defaultLocale = 'en';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale routing first
  const response = intlMiddleware(request);

  // If intl middleware already handled the request, use its response
  if (response.status !== 200) {
    return response;
  }

  // Get token for admin route protection
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the route is an admin route (with locale prefix)
  const isAdminRoute = pathname.match(/^\/[a-z]{2}\/admin/);

  if (isAdminRoute) {
    // If no token, redirect to login
    if (!token) {
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // If token exists but user is not admin, redirect to home
    if (token.role !== 'ADMIN') {
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
