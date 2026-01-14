import { OffersApi } from 'src/api';
export class AuthRoutes {
  static REGISTER = '/users/users/'; 
  static LOGIN = '/users/auth/token/'; 
  static GET_LOGIN_USER = (id: number) => `/users/users/${id}/`; 
  static REFRESH_TOKEN = '/accounts/refresh-token/';
  static REQUEST_PASSWORD_RESET = '/accounts/reset-password/request/';
  static RESET_PASSWORD = '/accounts/reset-password/submit/';
  static VERIFY_EMAIL = '/accounts/verify-email/';
}

export class AccountRoutes {
  // static USER_DATA = '/accounts/user-data';
  static USER_DATA = (id: number) => `/users/users/${id}/`;
  static USER_DELETE = '/users/users/me/delete/';
}

export class WebsocketRoutes {
  static GET_NOTIFICATIONS = '/ws/notifications/';
  static GET_REACTIONS_LIST = (reactable_type: string, reactable_id: number) => `/ws/reactable/${reactable_type}/${reactable_id}/`
}

export class OffersRoutes {
  static OFFERS = '/offers/';
  static OFFER = (id: number) => `/users/organization-filtering/${id}/`;
  static COMPANY = (id: number) => `/accounts/company-list-all/${id}/`;
}

export class AnimalsRouts {
  static ANIAML_LATEST = '/animals/latest/';
  static ANIMAL_ID = (id: number) => `/animals/animals/${id}/`;
  static ANIMAL_PARENTS_ID = (id: number) => `/animals/parents/${id}/`;
  // static ANIAML_FILTERING = '/animals/filtering/';
  // static ANIAML_FILTERING_ID = (id: number) => `/animals/filtering/${id}`;
  static ANIMALS_ANIMALS = '/animals/animals/';
  static ANIMAL_PARENTS = '/animals/parents/';

  static ANIAML_PROFILE = (id: number) => `/animals/animals/${id}/`;
  static ANIMAL_FAMILY_TREE = (id: number) => `/animals/family-tree/${id}/`
  static ANIMAL_PROFILE_COMMENTS  = (id: number) =>  `/common/comments/${id}/`
  
  static ANIMAL_SPECIES = "/users/species/"
  static ANIMAL_BREEDS = "/animals/animal-breed/"
}

export class OrganizationsRouts {
  static ORGANIZATION_LATEST = '/users/organization-latest/';

  static ORGANIZATION_PROFILE_ID = (id: number) => `/users/organizations/${id}/`
  // static ORGANIZATION_PROFILE = '/users/organization-filtering/'
  static ORGANIZATIONS = '/users/organizations/'

  static ORGANIZATION_ANIMALS = (id: number) => `/animals/animals/?organization-id=${id}`
  static ORGANIZATION_LITTERS = (id: number) => `/litters/litters/?organization-id=${id}`
  static ORGANIZATION_LITTERS_POST ='/litters/litters/'

  static LITTERS_ID = (id: number) => `/litters/litters/${id}/`
}

export class ArticlesRouts{
  static ARTICLES_LATEST = '/articles/articles-latest/';
  static ARTICLES_LIST = '/articles/articles/';
  // static ARTICLES_LIST_id = (id: number) => `/articles/articles/${id}`;
}

export class PostsRouts{
  static POSTS_LIST = '/posts/posts/';
  static POSTS_LIST_ID = (id: number) => `/posts/posts/${id}/`;

  static COMMENTS_LIST = '/common/comments/';
  static COMMENTS_LIST_ID = (id: number) => `/common/comments/${id}/`;
  static COMMENTS_ID = (id: number, content_type: string) => `/common/comments/?object_id=${id}&content_type=${content_type}`

  // static REACTIONS_LIST = '/common/reaction/'; 
  static REACTIONS = '/common/reactions/'
  static REACTIONS_ID = (id: number) => `/common/reactions/${id}/`
  static HAS_REACTION = (reactable_type: string, reactable_id: number) => `/common/reactions/has-reaction/?reactable_type=${reactable_type}&reactable_id=${reactable_id}`


  static ANIMAL_ACTIVITY = (id: number) => `posts/posts/?animal-id=${id}`
  static ORGANIZATION_POSTS = (id: number) => `/posts/posts/?organization-id=${id}`
}