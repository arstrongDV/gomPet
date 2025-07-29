export class AuthRoutes {
  static REGISTER = '/users/users/'; //  
  static LOGIN = '/users/auth/token/'; ///accounts/login/
  static GET_LOGIN_USER = '/users/users/{id}/'; ///accounts/user-data
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
  static OFFER = (id: number) => `/offers/${id}/`;
  static COMPANY = (id: number) => `/accounts/company-list-all/${id}/`;
}

export class WebsocketRoutes {
  static GET_NOTIFICATIONS = '/ws/notifications/';
}

export class AnimalsRouts {
  static ANIAML_LATEST = '/animals/latest/';
  static ANIAML_FILTERING = '/animals/filtering/';
  static ANIAML_PROFILE = '/animals/animals/{id}/';
}

export class OrganizationsRouts {
  static ORGANIZATION_LATEST = '/users/organization-latest/';
}
