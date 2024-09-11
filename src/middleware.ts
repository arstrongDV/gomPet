import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { auth } from 'src/auth';

import { PROTECTED_ROUTES, PUBLIC_ONLY_ROUTES, Routes } from './constants/routes';

const locales = ['pl'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'pl',
  localePrefix: 'as-needed'
});

const testPagesRegex = (pages: string[], pathname: string) => {
  const regex = `^(/(${locales.join('|')}))?(${pages.map((p) => p.replace('/*', '.*')).join('|')})/?$`;
  return new RegExp(regex, 'i').test(pathname);
};

const handleAuth = async (req: NextRequest, isPublicOnlyPage: boolean, isProtectedPage: boolean) => {
  const session = await auth();
  const isAuth = !!session?.user;

  if (!isAuth && isProtectedPage) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    const response = NextResponse.redirect(new URL(`${Routes.LOGIN}?from=${encodeURIComponent(from)}`, req.url));
    response.headers.set('x-current-path', req.nextUrl.pathname);

    return response;
  }

  if (isAuth && isPublicOnlyPage) {
    const response = NextResponse.redirect(new URL(Routes.LANDING, req.nextUrl));
    response.headers.set('x-current-path', req.nextUrl.pathname);
    return response;
  }

  const response = intlMiddleware(req);
  response.headers.set('x-current-path', req.nextUrl.pathname);

  return response;
};

export default async function middleware(req: NextRequest) {
  const isPublicOnlyPage = testPagesRegex(PUBLIC_ONLY_ROUTES, req.nextUrl.pathname);
  const isProtectedPage = testPagesRegex(PROTECTED_ROUTES, req.nextUrl.pathname);

  return await handleAuth(req, isPublicOnlyPage, isProtectedPage);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
