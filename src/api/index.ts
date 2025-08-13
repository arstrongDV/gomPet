import ApiClient from './client';
import { AccountRoutes, AnimalsRouts, ArticlesRouts, AuthRoutes, OffersRoutes, OrganizationsRouts } from './routes';
import { LoginPayload, RegisterPayload, ResetPasswordPayload, ResetPasswordRequestPayload } from './types';
import { jwtDecode } from 'jwt-decode';

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
    const decoded = jwtDecode(token) as { user_id: number };
    const { user_id } = decoded;
    const url = AuthRoutes.GET_LOGIN_USER(user_id);
    return ApiClient.get(url, undefined, {
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

export class AnimalsApi {
  static async getAnimalProfile(id: number){
    return ApiClient.get(AnimalsRouts.ANIAML_PROFILE(id))
  }

  static async getAnimalFamilyTree(id: number){
    return ApiClient.get(AnimalsRouts.ANIMAL_FAMILY_TREE(id))
  }

  static async getAnimalComments(id: number){
    return ApiClient.get(AnimalsRouts.ANIMAL_PROFILE_COMMENTS(id))
  }

  static async getAnimalPosts(id: number){
    return ApiClient.get(AnimalsRouts.ANIMAL_ACTIVITY(id))
  }

  static async getAnimalsLatest(
    limit: number = 5,
    filters?: {
      species?: string[];
      organizationType?: string[];
      characteristics?: string[];
    }
  ) {
    const params = {
      limit,
      ...(filters?.species && { species: filters.species.join(',') }),
      ...(filters?.organizationType && { 'organization-type': filters.organizationType.join(',') }),
      ...(filters?.characteristics && { characteristics: filters.characteristics.join(',') })
    };

    try {
      const response = await ApiClient.get(AnimalsRouts.ANIAML_LATEST, params, {
        __tokenRequired: false
      });

      const data = response.data?.results || response.data || [];
      return { 
        success: true,
        data: Array.isArray(data) ? data : [],
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }
  static async getAnimalsFilter(filters?: {
    limit?: number;
    page?: number;
    species?: string[];
    organizationType?: string[];
    organization_id?: number[];
    name?: string[];
    size?: string[];
    gender?: string[];
    age?: number[];
    location?: string[];
    range?: number[];
    breed_groups?: string[];
    characteristics?: string[];
  }) {
    const params: Record<string, any> = {
      ...(filters?.limit && { limit: filters.limit }),
      ...(filters?.page ? { page: filters.page } : {page: 1}),
      ...(filters?.species?.length && { species: filters.species.join(',') }),
      ...(filters?.organizationType?.length && { 'organization-type': filters.organizationType.join(',') }),
      ...(filters?.organization_id?.length && { 'organization-id': filters.organization_id.join(',') }),
      ...(filters?.characteristics?.length && { characteristics: filters.characteristics.join(',') }),
      ...(filters?.name?.length && { name: filters.name.join(',') }),
      ...(filters?.size?.length && { size: filters.size.join(',') }),
      ...(filters?.gender?.length && { gender: filters.gender.join(',') }),
      ...(filters?.age?.length && { age: filters.age.join(',') }),
      ...(filters?.location?.length && { location: filters.location.join(',') }),
      ...(filters?.range?.length && { range: filters.range.join(',') }),
      ...(filters?.breed_groups?.length && { breed_groups: filters.breed_groups.join(',') }),
    };
  
    try {
      const response = await ApiClient.get(AnimalsRouts.ANIAML_FILTERING, params, {
        __tokenRequired: false,
      });
  
      const { results, count } = response.data;
  
      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: count || 0,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        total: 0,
        error,
      };
    }
  }
  
}


export class OrganizationsApi {
  static async getLatestOrganizations(limit: number, filters?: {
    organizationType?: string[];
  }) {
    const params = new URLSearchParams();

    if (limit) params.append('limit', String(limit));
    if (filters?.organizationType) {
      params.append('organization-type', filters.organizationType.join(','));
    }
    
    try {
      const response = await ApiClient.get(OrganizationsRouts.ORGANIZATION_LATEST, { __tokenRequired: false });
      // if (!response.data?.results?.length && !response.data?.length) {
      //   return { data: [] };
      // }
      const {results, count} = response?.data;
      return {
        success: true,
        data: Array.isArray(results) ? results : [],
        total: count || 0,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        total: 0,
        error,
      };
    }
  }
}

export class ArticlesApi {
  static async getLatestArticles(limit?: number, author?: string) {
    const params: Record<string, any> = {};
    
    if (limit) params.limit = limit;
    if (author) params.author = author;

    try {
      const res = await ApiClient.get(
        ArticlesRouts.ARTICLES_LATEST,
        params, // Pass as plain object
        { __tokenRequired: false }
      );

      if (!res.data?.results?.length && !res.data?.length) {
        return { data: [] };
      }

      return res;
    } catch (error) {
      throw error;
    }
  }
}