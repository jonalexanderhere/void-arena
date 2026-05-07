import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified middleware for demonstration. 
// In a real production app with Auth.js or Supabase Auth, 
// you would use their built-in session checks.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    // Check for an admin cookie or session
    // This is a placeholder for actual auth logic
    const isAdmin = request.cookies.get('admin_session');
    
    if (!isAdmin) {
      // Redirect to login if not admin
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Protect Dashboard/Arena Routes
  const protectedRoutes = ['/dashboard', '/arena', '/classic', '/settings'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const session = request.cookies.get('session');
    if (!session) {
      // return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/arena/:path*',
    '/classic/:path*',
    '/settings/:path*',
  ],
};
