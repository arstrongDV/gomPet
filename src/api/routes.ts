export class AuthRoutes {
  static REGISTER = '/users/users/'; 
  static LOGIN = '/users/auth/token/'; 
  static GET_LOGIN_USER = (id: number) => `/users/users/${id}/`; 
  static REFRESH_TOKEN = '/users/auth/token/refresh/';
  static REQUEST_PASSWORD_RESET = '/users/auth/password-reset/';
  static RESET_PASSWORD = '/users/auth/password-reset/confirm/';
  static VERIFY_EMAIL = '/accounts/verify-email/';
}

export class AccountRoutes {
  static USER = '/users/users/';
  static USER_DATA = (id: number) => `/users/users/${id}/`;
  static USER_DELETE = '/users/users/me/delete/';
  static USER_PROFILE_INFO = (userId: number) => `/users/users/${userId}/profile-info`;
}

export class WebsocketRoutes {
  static GET_NOTIFICATIONS = (id: number) => `/ws/notifications/${id}/`;
  static GET_REACTIONS_LIST = (reactable_type: string, reactable_id: number) => `/ws/reactable/${reactable_type}/${reactable_id}/`;
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
  static ANIMALS_ANIMALS = '/animals/animals/';
  static ANIMAL_PARENTS = '/animals/parents/';
  static ANIAML_PROFILE = (id: number) => `/animals/animals/${id}/`;
  static ANIMAL_FAMILY_TREE = (id: number) => `/animals/family-tree/${id}/`;
  
  static ANIMAL_SPECIES = '/users/species/';
  static ANIMAL_BREEDS = (speciesId: number) => `/animals/animal-breed/?species=${speciesId}`;

  static ANIMAL_BOOKMARKS = (id: number) =>`/animals/animals/?liked-by=${id}`;
  static ANIMALS_CHARACTERISTICS = (type: string) => `/animals/characteristics/?species=${type}`;

  static USER_ANIMALS = (userId: number) => `animals/animals/?user-animals-by-id=${userId}`;
  static MY_ANIMALS = '/animals/animals/?user-animals=true';

  static MY_ORGANIZATIONS = '/animals/animals/assignment-options/';
}

export class OrganizationsRouts {
  static ORGANIZATION_LATEST = '/users/organization-latest/';
  static ORGANIZATION_PROFILE_ID = (id: number) => `/users/organizations/${id}/`;
  static ORGANIZATIONS = '/users/organizations/';
  static ORGANIZATION_ANIMALS = (id: number) => `/animals/animals/?organization-ids=${id}`;
  static ORGANIZATION_LITTERS = (id: number) => `/litters/litters/?organization-id=${id}`;
  static ORGANIZATION_LITTERS_POST = '/litters/litters/';
  static LITTERS_ID = (id: number) => `/litters/litters/${id}/`;

  static ORGANIZATION_MEMBERS = '/users/organization-members/';
  static ORGANIZATION_ROLES = '/users/organization-member-roles/';
  static ORGANIZATION_MEMBERS_ID = (id: number) => `/users/organization-members/${id}/`;
  static MEMBERS_REQUESTS = (id: number) =>  `/users/organization-members/?organization-id=${id}`;
  static MEMBER_INVITATION = (id: number) => `/users/organization-members/${id}/`;
  static ORGANIZATION_MEMBERS_CONFIRMED = (id: number) => `/users/organization-members/?organization-id-confirmed=${id}`;

  static MY_ORGANIZATIONS = (myOrg: boolean) => `/users/organization-members/?mine=${myOrg}`;
  static USER_ORGANIZATIONS = (userId: number) => `/users/organization-members/?organizations-user-by-id=${userId}`;
  static CHANGE_OWNER = (orgId: number) => `/users/organizations/${orgId}/change-owner/`;
}

export class ArticlesRouts {
  static ARTICLES_LATEST = '/articles/articles-latest/';
  static ARTICLES_LIST = '/articles/articles/';
  static ARTICLES_SLUG = (slug: string) => `/articles/articles/${slug}/`;
  static ARTICLES_KNOWLEDGE_LIST = (category: any) => `/articles/articles/?${category}`; 
  static ARTICLES_CATEGORIES = '/articles/article-categories/';
}

export class PostsRouts {
  static POSTS_LIST = '/posts/posts/';
  static POSTS_LIST_ID = (id: number) => `/posts/posts/${id}/`;
  static ANIMAL_ACTIVITY = (id: number) => `posts/posts/?animal-id=${id}`;
  static ORGANIZATION_POSTS = (id: number) => `/posts/posts/?organization-id=${id}`;

  static POSTS = '/posts/posts/feed/';
}

export class CommonRouts {
  // Commnets
  static COMMENTS_LIST = '/common/comments/';
  static COMMENTS_LIST_ID = (id: number) => `/common/comments/${id}/`;
  static COMMENTS_ID = (id: number, content_type: string) => `/common/comments/?object_id=${id}&content_type=${content_type}`;

  // Reactions
  static REACTIONS_LIST = '/common/reaction/'; 
  static REACTIONS = '/common/reactions/';
  static REACTIONS_ID = (id: number) => `/common/reactions/${id}/`;
  static HAS_REACTION = (reactable_type: string, reactable_id: number) => `/common/reactions/has-reaction/?reactable_type=${reactable_type}&reactable_id=${reactable_id}`;

  // Following
  static HAS_FOLLOWED = (target_typ: string, organizationId: number) => `/common/follows/is-following/?target_type=${target_typ}&target_id=${organizationId}`;
  static FOLLOWS = '/common/follows/';
  static FOLLOWS_ID = (id: number) => `/common/follows/${id}/`;
  static FOLLOWING = (target_type: string, target_id: number) => `/common/follows/followers-count/?target_type=${target_type}&target_id=${target_id}`;
 }
