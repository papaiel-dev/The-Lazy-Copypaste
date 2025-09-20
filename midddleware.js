import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard.html',
  '/manage.html',
  '/edit.html',
  '/account.html'
];

const API_ROUTES = [
  '/api/delete-user'
];

export function middleware(request) {
  const token = request.cookies.get('sb-access-token');

  // Protege as páginas internas
  if (PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Protege as rotas de API sensíveis
  if (API_ROUTES.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard.html', '/manage.html', '/edit.html', '/account.html', '/api/delete-user']
};