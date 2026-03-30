import { NextResponse } from 'next/server';

export function middleware(req) {
  const session = req.cookies.get('admin_session');
  const { pathname } = req.nextUrl;

  // Halaman yang mau diproteksi
  const protectedPages = ['/list', '/seting', '/tambah'];

  if (protectedPages.some(page => pathname.startsWith(page))) {
    if (!session) {
      // Kalau gak ada session, tendang balik ke login
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/list/:path*', '/seting/:path*', '/tambah/:path*'],
};
