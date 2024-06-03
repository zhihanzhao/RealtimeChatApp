import { UserI } from './user.interface';
import { MetaI } from './meta.interface';

export interface RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  created_at?: Date;
  updated_at?: Date;
}

export interface RoomPaginateI {
  items: RoomI[];
  meta: MetaI;
}
