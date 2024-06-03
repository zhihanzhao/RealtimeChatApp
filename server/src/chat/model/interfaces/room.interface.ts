import { User } from 'src/user/model/interfaces/user.interface';

export interface Room {
  id?: number;
  name?: string;
  description?: string;
  users?: User[];
  created_at?: Date;
  updated_at?: Date;
}
