import { User } from 'src/user/model/interfaces/user.interface';
import { Room } from './room.interface';

export interface JoinedRoom {
  id?: number;
  socketId: string;
  user: User;
  room: Room;
}
