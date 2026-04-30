import { IUser } from './user';
import { IOrganization } from './organization';
import { IComment } from './post';
import { ICategory } from './common';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AnimalStatus {
  AVAILABLE = 'available',
  HAS_OWNER = 'has_owner',
  QUARANTINE = 'quarantine',
}

export enum AnimalSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum AnimalSpecies {
  DOG = 'dog',
  CAT = 'cat',
}

export enum BREED {
  TERRIERS = 'terriers',
}

export enum AnimalAge {
  OLD = 'old',
  YOUNG = 'young',
}

export interface ISpecies {
  id: number;
  name: string;
}

export interface IBreed {
  id: number;
  label: string;
  species: number;
}

interface ICharacteristic {
  title: string;
  bool: boolean;
}

export interface IAnimal {
  id: number;
  name: string;
  image: string | null;
  gallery: string[];
  species: string;
  breed: string;
  gender: Gender | string;
  size: AnimalSize;
  age: number;
  birth_date: string | null;
  created_at: string;
  city: string;
  owner: IUser | IOrganization;
  parents: IAnimal[];
  status: AnimalStatus;
  descriptions: string;
  organization: IOrganization;
  life_period: string;
  owner_info: IUser;
  price: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  images: string[];
  characteristicBoard: ICharacteristic[];
  comments: IComment[];
  famillyTree: ICategory[];
}
