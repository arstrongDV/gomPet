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
  static readonly ANIMAL_PROFILE = (id: number) =>  `/animals/${id}`;
  static readonly EDIT = (id: number) => `/animals/${id}/edit`
  static readonly ORGANIZATION_EDIT= (id: number) => `/organizations/${id}/edit`
  static readonly MY_ANIMALS = '/my-animals';
  static readonly NEW_ANIMAL = '/new-animal';
  static readonly PROFILE = '/profile'
  // static readonly POSTS = '/posts';
  static readonly ARTICLES = '/articles';
  static readonly KNOWLEDGE = '/knowledge';
  static readonly BLOG_ARTICLE = (slug: string) => `/blog/${slug}`;
  static readonly OFFERS = '/offers';
  static readonly OFFER = (id: number) => `/offers/${id}`;
  static readonly NEW_ORGANIZATION = '/new-organization';
  static readonly ORGANIZATION_PROFILE = (id: string | number) => `/organizations/${id}`;
  static readonly NEW_LITTER = (id: number) => `/new-litter?orgId=${id}`;
  static readonly LITTER_EDIT= (id: number) => `/organizations/${id}/litters-edit`

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

export const PROTECTED_ROUTES = [Routes.DASHBOARD, Routes.LIBRARY, Routes.NEW_ORGANIZATION, Routes.NEW_ANIMAL, Routes.MY_ANIMALS];
