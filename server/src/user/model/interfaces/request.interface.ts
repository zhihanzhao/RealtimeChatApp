import { User } from './user.interface';

export interface RequestModel extends Request {
  user: User;
}
