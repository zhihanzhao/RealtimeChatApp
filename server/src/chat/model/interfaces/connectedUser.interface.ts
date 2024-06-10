import { User } from 'src/user/model/interfaces/user.interface';

export interface ConnectedUser {
  id?: number;
  socketId: string;
  user: User;
}
