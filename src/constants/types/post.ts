import { IUser } from './user';
import { IOrganization } from './organization';

export interface IComment {
  id: number;
  body: string;
  created_at: string;
  updated_at?: string;
  author: IUser;
  rating: number;
}

export interface IReaction {
  author: IUser | IOrganization;
  author_type: 'user' | 'organization';
  type: 'like' | 'dislike';
}

export interface IPost {
  id: number;
  text: string;
  image: string | null;
  author: IUser | IOrganization;
  animal?: number;
  animal_name?: string;
  created_at: string | undefined;
  updated_at?: string | undefined;
  full_name?: string;
  slug?: string;
  title?: string;
  content?: string;
  comments: IComment[];
  reactions: IReaction[];
  organization_info?: IOrganization;
}
