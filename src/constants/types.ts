export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export enum OrganizationType {
  ANIMAL_SHELTER = 'animal_shelter',
  FUND = 'fund',
  BREEDING = 'breeding'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum AnimalStatus {
  AVAILABLE = 'available',
  HAS_OWNER = 'has_owner',
  QUARANTINE = 'quarantine'
}

export enum AnimalSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export interface IUser {
  id: number;
  email?: string;
  image: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface IOrganization {
  id: number;
  type: OrganizationType;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  description: string;
  rating: number;
  address: {
    city: string;
    street: string;
    house_number: string;
    zip_code: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  // details only for BREEDING type
  details?: {
    species: string[];
    breeds: string[];
  };
  created_at: string;
}

export interface IComment {
  id: number;
  text: string;
  created_at: string;
  updated_at?: string;
  rating: number;
  author: IUser | IOrganization;
}

export interface IAnimal {
  id: number;
  name: string;
  image: string | null;
  gallery: string[];
  species: string;
  breed: string;
  gender: Gender;
  size: AnimalSize;
  age: number;
  birth_date: string | null;
  created_at: string;
  owner: IUser | IOrganization;
  parents: IAnimal[];
  status: AnimalStatus;
  characteristics: string[];
}

export interface IPost {
  id: number;
  text: string;
  image: string | null;
  created_at: string;
  updated_at?: string;
  comments: Omit<IComment, 'rating'>[];
  reactions: {
    author: IUser | IOrganization;
    author_type: 'user' | 'organization';
    type: 'like' | 'dislike';
  }[];
}

export interface withPagination<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
