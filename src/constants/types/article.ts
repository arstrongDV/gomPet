import { IUser } from './user';
import { IOrganization } from './organization';
import { ICategory } from './common';

export interface IArticle {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  categories: { code: string; group: string; id: number }[];
  groups: { id: number; label: string }[];
  author?: IUser | IOrganization;
  category?: ICategory;
}
