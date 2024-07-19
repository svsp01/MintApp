import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const url = request.nextUrl.clone();

  // Define paths for static assets and API routes
  const staticAssetPaths = ['/static/', '/_next/', '/favicon.ico'];
  const apiRoutes = ['/api/'];

  // Skip middleware for static assets and API routes
  if (staticAssetPaths.some(path => request.nextUrl.pathname.startsWith(path)) ||
      apiRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Define public routes
  const publicRoutes = ['/login', '/'];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    if (token) {
      // Redirect authenticated users from public routes to dashboard
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  } else {
    // Handle protected routes
    if (token) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/', '/:path*'], // Apply middleware to all routes except static assets and API routes
};
