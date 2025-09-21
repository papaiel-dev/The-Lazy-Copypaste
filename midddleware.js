import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('sb-access-token');

  // Protege todas as rotas que não sejam a raiz
  if (request.nextUrl.pathname !== '/') {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard.html', '/manage.html', '/edit.html', '/account.html', '/api/delete-user']
};