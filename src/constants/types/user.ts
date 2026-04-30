import { OptionType } from 'src/components/layout/Forms/Select';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export type Location = {
  city: string;
  street: string;
  house_number: string;
  zip_code: string;
  lat: string | number;
  lng: string | number;
  coordinates: [lng: string | number, lat: string | number];
  species?: OptionType[];
  location?: {
    type: string;
    coordinates: [lng: string | number, lat: string | number];
    species?: number[];
  };
};

export type GeoPoint = {
  type: 'Point';
  coordinates: [longitude: number, latitude: number];
};

export interface IUser {
  id: number;
  email?: string;
  image: string | null;
  first_name: string;
  full_name?: string;
  last_name: string;
  phone: string | null;
  role: Role;
  created_at: string;
  updated_at?: string;
  location: Location | GeoPoint | null;
}
