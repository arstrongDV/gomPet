import { IUser } from './user';

export interface NotificaitonItemType {
  id?: number;
  created_at: string;
  origin?: {
    id: number;
    label?: string;
    type: string;
  } | null;
  actor: IUser;
  type: string;
  target_type: string;
  target_id?: number;
  target_label?: string;
  target_organization?: {
    id: number;
    name: string;
    email: string;
  } | null;
  target_owner?: IUser | null;
  verb: string;
  is_read: boolean;
  code?: string;
  created_object_id?: number;
}
