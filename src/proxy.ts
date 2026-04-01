import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { auth } from 'src/auth';
import { locales } from 'src/navigation';

import { PROTECTED_ROUTES, PUBLIC_ONLY_ROUTES, Routes } from './constants/routes';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'pl',
  localePrefix: 'as-needed'
});

const testPagesRegex = (pages: string[], pathname: string) => {
  const regex = `^(/(${locales.join('|')}))?(${pages.map((p) => p.replace('/*', '.*')).join('|')})/?$`;
  return new RegExp(regex, 'i').test(pathname);
};

type ProxyAuthRequest = NextRequest & {
  auth?: {
    user?: unknown;
  } | null;
};

const handleAuth = async (req: ProxyAuthRequest, isPublicOnlyPage: boolean, isProtectedPage: boolean) => {
  const isAuth = !!req.auth?.user;

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

  if (locales.length === 1) {
    const [defaultLocale] = locales;
    const localePath = `/${defaultLocale}`;
    const { pathname } = req.nextUrl;

    if (pathname === localePath || pathname.startsWith(`${localePath}/`)) {
      const response = NextResponse.next();
      response.headers.set('x-current-path', req.nextUrl.pathname);
      return response;
    }

    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = pathname === '/' ? localePath : `${localePath}${pathname}`;

    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-current-path', req.nextUrl.pathname);
    return response;
  }

  const response = intlMiddleware(req);
  response.headers.set('x-current-path', req.nextUrl.pathname);

  return response;
};

const proxy = async (req: ProxyAuthRequest) => {
  const isPublicOnlyPage = testPagesRegex(PUBLIC_ONLY_ROUTES, req.nextUrl.pathname);
  const isProtectedPage = testPagesRegex(PROTECTED_ROUTES, req.nextUrl.pathname);

  return await handleAuth(req, isPublicOnlyPage, isProtectedPage);
};

export default auth(proxy);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
