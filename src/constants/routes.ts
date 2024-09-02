export class Routes {
  // -- PUBLIC & PROTECTED --
  static readonly LANDING = '/';
  static readonly LIBRARY = '/library';
  static readonly DOC_STATUTE = '/documents/statute';
  static readonly DOC_PRIVACY = '/documents/privacy-policy';
  static readonly SHELTERS = '/shelters';
  static readonly FOUNDATIONS = '/foundations';
  static readonly BREEDINGS = '/breedings';
  static readonly ANIMALS = '/animals';
  static readonly MY_ANIMALS = '/my-animals';
  static readonly POSTS = '/posts';
  static readonly BLOG = '/blog';
  static readonly BLOG_ARTICLE = (slug: string) => `/blog/${slug}`;
  static readonly OFFERS = '/offers';
  static readonly OFFER = (id: number) => `/offers/${id}`;

  // -- PUBLIC ONLY --
  // Auth
  static readonly HOME = '/auth';
  static readonly LOGIN = '/auth/login';
  static readonly SIGNUP = '/auth/signup';
  static readonly LOGOUT = '/auth/logout';
  static readonly PASSWORD_FORGET = '/auth/password-forget';
  static readonly PASSWORD_FORGET_RESET = '/auth/password-forget/reset';
  static readonly VERIFY_EMAIL = '/auth/verify-email';

  // -- PROTECTED --
  static readonly DASHBOARD = '/u/dashboard';
  static readonly BOOKMARKS = '/bookmarks';

  // -- CONFIG --
  static readonly LOGIN_REDIRECT = this.LANDING;
}

export const PUBLIC_ONLY_ROUTES = [
  Routes.LOGIN,
  Routes.SIGNUP,
  Routes.PASSWORD_FORGET,
  Routes.PASSWORD_FORGET_RESET,
  Routes.VERIFY_EMAIL
];

export const PROTECTED_ROUTES = [Routes.DASHBOARD, Routes.LIBRARY];
