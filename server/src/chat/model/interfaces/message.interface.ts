import { User } from 'src/user/model/interfaces/user.interface';
import { Room } from './room.interface';

export interface Message {
  id?: number;
  text: string;
  user: User;
  room: Room;
  created_at: Date;
  updated_at: Date;
}
