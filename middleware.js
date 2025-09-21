import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('sb-access-token');

  const PROTECTED_ROUTES = [
    '/dashboard.html',
    '/manage.html',
    '/edit.html',
    '/account.html'
  ];

  if (PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard.html', '/manage.html', '/edit.html', '/account.html']
};