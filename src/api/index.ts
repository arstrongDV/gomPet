import { Params } from 'src/constants/params';
import ApiClient from './client';
import { AccountRoutes, AnimalsRouts, ArticlesRouts, AuthRoutes, OffersRoutes, OrganizationsRouts, PostsRouts, WebsocketRoutes } from './routes';
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

  static async getAnimals(filters: {
    organizationType?: string[];
    limit?: number;
    page?: number;
    organizationId?: string[];
    gender?: string[];
    species?: string[];
    breed?: string[];
    location?: string[];
    name?: string;
    range?: number;
  } = {}) {

    const params = {
      ...(filters?.limit && { limit: filters.limit }),
      ...(filters?.page ? { page: filters.page } : {page: 1}),
      ...(filters?.organizationType && { 'organization-type': filters.organizationType.join('&') }),
      ...(filters?.organizationId && { 'organization-id': filters.organizationId.join('&') }),
      ...(filters?.gender && { gender: filters.gender.join('&') }),
      ...(filters?.breed && { breed: filters.breed.join('&') }),
      ...(filters?.location && { location: filters.location.join('&') }),
      ...(filters?.species && { species: filters.species.join('&') }),
      ...(filters?.range && { range: filters.range }), /// join('&')
      ...(filters?.name && { name: filters.name }),/// join('&')
    };

    // const queryParams: Record<string, string> = {};
    // if (filters.organizationType?.length) {
    //   queryParams['organization-type'] = filters.organizationType.join('&');
    // }
  
    // if (filters.organizationId?.length) {
    //   queryParams['organization-id'] = filters.organizationId.join('&');
    // }
  
    // if (filters.gender?.length) {
    //   queryParams['gender'] = filters.gender.join('&');
    // }
  
    // if (filters.species?.length) {
    //   queryParams['species'] = filters.species.join('&');
    // }
  
    // if (filters.breed?.length) {
    //   queryParams['breed'] = filters.breed.join('&');
    // }
  
    // if (filters.location?.length) {
    //   queryParams['location'] = filters.location.join('&');
    // }

    // if (filters.name) {
    //   queryParams['name'] = filters.name;
    // }
  
    // if (filters.range) {
    //   queryParams['range'] = filters.range.toString();
    // }
  
    return ApiClient.get(AnimalsRouts.ANIMALS_ANIMALS, params , {
      __tokenRequired: true,
    });
  }
  static async getAnimalProfile(id: number){
    return ApiClient.get(AnimalsRouts.ANIAML_PROFILE(id))
  }
  static async createNewAnimal(formData: FormData) {
    return ApiClient.post(AnimalsRouts.ANIMALS_ANIMALS, formData, {
      __tokenRequired: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async getAnimalParents(){
    return ApiClient.get(AnimalsRouts.ANIMAL_PARENTS, {
      __tokenRequired: true,
    })
  }
  static async updateAnimal(id: number, data: any) {
    return ApiClient.put(AnimalsRouts.ANIMAL_ID(id), data, {
      __tokenRequired: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async clearAnimalParents(id: number){
    return ApiClient.delete(AnimalsRouts.ANIMAL_PARENTS_ID(id), {
      __tokenRequired: true,
    });
  }
  static async updateAnimalParents(id: number, data: any) {
    return ApiClient.put(AnimalsRouts.ANIMAL_PARENTS_ID(id), data, {
      __tokenRequired: true,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });
  }
  static async deleteAnimal(id: number){
    return ApiClient.delete(AnimalsRouts.ANIMAL_ID(id), {
      __tokenRequired: true,
    });
  }
  static async addAnimalParents(parents: any){
    return ApiClient.post(AnimalsRouts.ANIMAL_PARENTS, parents, {
      __tokenRequired: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  static async postAnimalsParents(payload: any) {
    return ApiClient.post(AnimalsRouts.ANIMAL_PARENTS, payload, {
      __tokenRequired: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  static async getAnimalFamilyTree(id: number){
    return ApiClient.get(AnimalsRouts.ANIMAL_FAMILY_TREE(id))
  }

  static async getAnimalComments(id: number){
    return ApiClient.get(AnimalsRouts.ANIMAL_PROFILE_COMMENTS(id))
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
    breed?: string[];
    organizationType?: string[];
    organization_id?: number[];
    name?: string[];
    size?: string[];
    gender?: string[];
    // age?: number[];
    minAge?: number[];
    maxAge?: number[];
    city?: string[];
    range?: number[];
    breed_groups?: string[];
    characteristics?: string[];
  }) {
    const params: Record<string, any> = {
      ...(filters?.limit && { limit: filters.limit }),
      ...(filters?.page ? { page: filters.page } : {page: 1}),
      ...(filters?.species?.length && { species: filters.species.join(',') }),
      ...(filters?.breed?.length && { breed: filters.breed.join(',') }),
      ...(filters?.organizationType?.length && { 'organization-type': filters.organizationType.join(',') }),
      ...(filters?.organization_id?.length && { 'organization-id': filters.organization_id.join(',') }),
      ...(filters?.characteristics?.length && { characteristics: filters.characteristics.join(',') }),
      ...(filters?.name?.length && { name: filters.name.join(',') }),
      ...(filters?.size?.length && { size: filters.size.join(',') }),
      ...(filters?.gender?.length && { gender: filters.gender.join(',') }),
      // ...(filters?.age?.length && { age: filters.age.join(',') }),
      ...(filters?.minAge?.length && { 'age-min': filters.minAge.join(',') }),
      ...(filters?.maxAge?.length && { 'age-max': filters.maxAge.join(',') }),
      ...(filters?.city?.length && { city: filters.city.join(',') }),
      ...(filters?.range?.length && { range: filters.range.join(',') }),
      ...(filters?.breed_groups?.length && { breed_groups: filters.breed_groups.join(',') }),
    };
  
    try {
      const response = await ApiClient.get(AnimalsRouts.ANIMALS_ANIMALS, params, {
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

  static async getOrganizations(params?: object){
    return ApiClient.get(
      OrganizationsRouts.ORGANIZATION_PROFILE,
      params,
      { __tokenRequired: false }
    );
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
  static getArticlesList() {
    return ApiClient.get(ArticlesRouts.ARTICLES_LIST, {
      __tokenRequired: false,
    })
  }


  static AddNewReaction(payload: any) {
    return ApiClient.post(ArticlesRouts.REACTIONS, payload, {
      __tokenRequired: true,
    })
  }
  static deleteReaction(id: number) {
    return ApiClient.delete(ArticlesRouts.REACTIONS_ID(id), {
      __tokenRequired: true,
    })
  }
  static verifyReactions(reactable_type: string, reactable_id: number){
    return ApiClient.get(ArticlesRouts.HAS_REACTION(reactable_type, reactable_id), {
      __tokenRequired: true,
    })
  }

}

export class PostsApi {
  static async getAnimalPosts(animalId: number) {
    try {
      const response = await ApiClient.get(PostsRouts.ANIMAL_ACTIVITY(animalId), {
        __tokenRequired: false,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static deletePost(id: number){
    return ApiClient.delete(PostsRouts.POSTS_LIST_ID(id), {
      __tokenRequired: true,
    })
  }

  static updatePost(id: number, payload: any){
    return ApiClient.put(PostsRouts.POSTS_LIST_ID(id), payload, {
      __tokenRequired: true,
    })
  }

  static addNewAnimalPost({payload}: any) {
    return ApiClient.post(PostsRouts.POSTS_LIST, payload, {
      __tokenRequired: true,
    })
  }

  //Comments
  static async getComments(PostId: number, content_type: string) {
    try {
      const response = await ApiClient.get(PostsRouts.COMMENTS_ID(PostId, content_type), {
        __tokenRequired: false,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async addNewComments({ content_type, object_id, body }: { content_type: string; object_id: number; body: string }) {
    const response = await ApiClient.post(
      PostsRouts.COMMENTS_LIST,
      { content_type, object_id, body },
      { __tokenRequired: true }
    );
    return response.data;
  }
  static async deleteComment(id: number){
    return ApiClient.delete(PostsRouts.COMMENTS_LIST_ID(id), {
       __tokenRequired: true 
    })
  }
  static async updateComment(id: number, data: { body: string }){
    return ApiClient.patch(PostsRouts.COMMENTS_LIST_ID(id), data, {
      __tokenRequired: true 
    })
  }
}