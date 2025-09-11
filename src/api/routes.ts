export class AuthRoutes {
  static REGISTER = '/users/users/'; //  
  static LOGIN = '/users/auth/token/'; ///accounts/login/
  static GET_LOGIN_USER = (id: number) => `/users/users/${id}/`; ///accounts/user-data
  static REFRESH_TOKEN = '/accounts/refresh-token/';
  static REQUEST_PASSWORD_RESET = '/accounts/reset-password/request/';
  static RESET_PASSWORD = '/accounts/reset-password/submit/';
  static VERIFY_EMAIL = '/accounts/verify-email/';
}

export class AccountRoutes {
  static USER_DATA = '/accounts/user-data';
}

export class OffersRoutes {
  static OFFERS = '/offers/';
  static OFFER = (id: number) => `/users/organization-filtering/${id}/`; // /users/organizations/{id}/
  static COMPANY = (id: number) => `/accounts/company-list-all/${id}/`;
}

export class WebsocketRoutes {
  static GET_NOTIFICATIONS = '/ws/notifications/';
}

export class AnimalsRouts {
  static ANIAML_LATEST = '/animals/latest/';

  static ANIAML_FILTERING = '/animals/filtering/';
  static ANIAML_FILTERING_ID = (id: number) => `/animals/filtering/${id}`;

  static NEW_ANIMAL = '/animals/animals/';

  static ANIAML_PROFILE = (id: number) => `/animals/animals/${id}/`;
  static ANIMAL_FAMILY_TREE = (id: number) => `/animals/family-tree/${id}/`
  static ANIMAL_PROFILE_COMMENTS  = (id: number) =>  `/common/comments/${id}/`
  static ANIMAL_ACTIVITY = (id: number) => `posts/posts/?animal-id=${id}` // `posts/posts/${id}`
}

export class OrganizationsRouts {
  static ORGANIZATION_LATEST = '/users/organization-latest/';
  // static ORGANIZATION_PROFILE = '/users/organizations/';
  // static ORGANIZATION_PROFILE_ID = '/users/organizations/{id}/'
  static ORGANIZATION_PROFILE = '/users/organization-filtering/'

}

export class ArticlesRouts{
  static ARTICLES_LATEST = '/articles/articles-latest/';
}

export class PostsRouts{
  static POSTS_LIST = '/posts/posts/';
}