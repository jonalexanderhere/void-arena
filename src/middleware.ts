import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 1. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'admin') {
      // return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 2. Protect Dashboard/Arena Routes
  const protectedRoutes = ['/dashboard', '/arena', '/classic', '/settings'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
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
