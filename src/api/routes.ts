export class AuthRoutes {
  static REGISTER = '/accounts/register/';
  static LOGIN = '/accounts/login/';
  static GET_LOGIN_USER = '/accounts/user-data';
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
