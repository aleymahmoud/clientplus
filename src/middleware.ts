import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to login page
    if (pathname.startsWith('/login')) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based access control
    if (pathname.startsWith('/admin')) {
      if (token.role !== 'SUPER_USER') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    if (pathname.startsWith('/settings')) {
      if (!['SUPER_USER', 'LEAD_CONSULTANT'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow login page without token
        if (req.nextUrl.pathname.startsWith('/login')) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};