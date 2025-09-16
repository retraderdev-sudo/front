import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import {
  getLocalizedUrl,
  extractLocaleFromPath,
} from './utils/url-localization';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
});

// Function to get user role from NextAuth token
async function getUserRoleFromToken(
  request: NextRequest
): Promise<string | null> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    return (token?.role as string) || null;
  } catch (error) {
    console.error('Error getting NextAuth token:', error);
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  // Get NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = (token?.role as string) || null;

  // Define route types
  const protectedPaths = ['/home', '/dashboard'];
  const authPaths = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.includes(path));

  // Handle root path redirect
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    if (isAuthenticated) {
      // Redirect based on user role
      const redirectPath = userRole === 'admin' ? '/dashboard' : '/home';
      url.pathname = getLocalizedUrl(redirectPath, 'en');
    } else {
      url.pathname = getLocalizedUrl('/login', 'en');
    }
    return NextResponse.redirect(url);
  }

  // Handle non-localized routes - redirect to localized version
  const nonLocalizedRoutes = ['/login', '/register', '/home', '/dashboard'];
  const isNonLocalizedRoute = nonLocalizedRoutes.some(
    (route) => pathname === route
  );

  if (isNonLocalizedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedUrl(pathname, 'en'); // Default to English
    return NextResponse.redirect(url);
  }

  // Extract locale from pathname for localized routes
  const locale = extractLocaleFromPath(pathname);

  // Handle protected routes
  if (isProtectedPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedUrl('/login', locale);
    return NextResponse.redirect(url);
  }

  // Handle auth routes (login/register) - redirect authenticated users based on role
  if (isAuthPath && isAuthenticated) {
    const url = request.nextUrl.clone();
    const redirectPath = userRole === 'admin' ? '/dashboard' : '/home';
    url.pathname = getLocalizedUrl(redirectPath, locale);
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
