import { Location } from './user';

export enum OrganizationType {
  ANIMAL_SHELTER = 'animal_shelter',
  FUND = 'fund',
  BREEDING = 'breeding',
}

export enum LitterStatus {
  AVAILABLE = 'available',
  CAN_RESERVE = 'can_reserve',
  NO_RESERVE_SLOTS = 'no_reserve_slots',
  ALREADY_GIVEN = 'already_given',
}

export interface IOrganization {
  id: number;
  user: number;
  type: OrganizationType;
  name: string;
  full_name?: string;
  email: string;
  image: string | null;
  phone: string | null;
  description: string;
  rating: number;
  address: Location;
  location: Location;
  race: string;
  breed: string;
  created_at: string;
}

export interface ILitter {
  id: number;
  species: { label: string; value: string };
  breed: { label: string; value: string };
  title: string;
  description: string;
  birth_date: string;
  status: LitterStatus;
  owner?: IOrganization | null;
  created_at: string;
}
