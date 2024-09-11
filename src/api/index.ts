import ApiClient from './client';
import { AccountRoutes, AuthRoutes, OffersRoutes } from './routes';
import { LoginPayload, RegisterPayload, ResetPasswordPayload, ResetPasswordRequestPayload } from './types';

export class AuthApi {
  static register(payload: RegisterPayload) {
    return ApiClient.post(AuthRoutes.REGISTER, payload, {
      __tokenRequired: false
    });
  }

  static login(payload: LoginPayload) {
    return ApiClient.post(AuthRoutes.LOGIN, payload, {
      __tokenRequired: false
    });
  }

  static getLoginUser(token: string) {
    return ApiClient.get(AuthRoutes.GET_LOGIN_USER, undefined, {
      __tokenRequired: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  static requestPasswordReset(payload: ResetPasswordRequestPayload) {
    return ApiClient.post(AuthRoutes.REQUEST_PASSWORD_RESET, payload, {
      __tokenRequired: false
    });
  }

  static resetPassword(payload: ResetPasswordPayload) {
    return ApiClient.post(AuthRoutes.RESET_PASSWORD, payload, {
      __tokenRequired: false
    });
  }

  static refreshAuthToken(payload: { refresh: string }) {
    return ApiClient.post(AuthRoutes.REFRESH_TOKEN, payload, {
      __tokenRequired: false
    });
  }

  static verifyEmail(payload: { token: string }) {
    return ApiClient.get(AuthRoutes.VERIFY_EMAIL, payload, {
      __tokenRequired: false
    });
  }
}

export class AccountsApi {
  static getUserData() {
    return ApiClient.get(AccountRoutes.USER_DATA);
  }
}

export class OffersApi {
  static getOffers(params?: object) {
    return ApiClient.get(OffersRoutes.OFFERS, params);
  }

  static getOffer(id: number) {
    return ApiClient.get(OffersRoutes.OFFER(id));
  }

  static getCompany(id: number) {
    return ApiClient.get(OffersRoutes.COMPANY(id));
  }
}
