// import { IComment } from './types';

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

export enum LitterStatus {
  AVAILABLE = 'available',
  CAN_RESERVE = 'can_reserve',
  NO_RESERVE_SLOTS = 'no_reserve_slots',
  ALREADY_GIVEN = 'already_given'
}

export enum AnimalStatus {
  AVAILABLE = 'available',
  HAS_OWNER = 'has_owner',
  QUARANTINE = 'quarantine'
}

export enum AnimalSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export enum AnimalSpecies {
  DOG = 'dog',
  CAT = 'cat'
}

export enum BREED {
  TERRIERS = 'terriers'
}

export enum AnimalAge {
  OLD = 'old',
  YOUNG = 'young'
}

export type Location = {
  city: string;
  street: string;
  house_number: string;
  zip_code: string;
  lat: string | number;
  lng: string | number;
};

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
  address: Location;
  // details only for BREEDING type
  details?: {
    species: string[];
    breeds: string[];
  };
  created_at: string;
}


export interface IComment {
  id: number;
  body: string; // comment
  created_at: string;
  updated_at?: string;
  author: IUser;
  rating: number;
}

interface ICharacteristic {
  title: string;
  bool: boolean;
}

export interface ICategory {
  id: number;
  name: string;
  image: string | null;
  children: ICategory[];
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
  city: string;
  owner: T<IUser | IOrganization>;
  parents: IAnimal[];
  status: AnimalStatus;
  descriptions: string;
  characteristicsBoard: string[];

  price: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // longitude, latitude
  } | null;
  images: string[];
  characteristicBoard: ICharacteristic[];
  comments: IComment[];

  famillyTree: ICategory[];
}

export interface ILitter {
  id: number;
  species: string;
  breed: string;
  title: string;
  description: string;
  birth_date: string;
  status: LitterStatus;
  owner?: IOrganization | null;
  created_at: string;
}

export interface IPost {
  id: number;
  text: string;
  image: string | null;
  author: IUser | IOrganization;
  created_at: string;
  updated_at?: string;
  full_name?: string;
  slug?: string;
  title?: string; 
  content?: string;
  // comments: Omit<IComment, 'rating'>[];
  comments: IComment[];
  reactions: {
    author: IUser | IOrganization;
    author_type: 'user' | 'organization';
    type: 'like' | 'dislike';
  }[];
}

export interface IArticle {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
}

export interface withPagination<T = any> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}