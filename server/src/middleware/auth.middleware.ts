import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { RequestModel } from 'src/user/model/interfaces/request.interface';
import { User } from 'src/user/model/interfaces/user.interface';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req: RequestModel, res: Response, next: NextFunction) {
    console.log(`Request URL: ${req.url}`);
    try {
      const tokenArray = req.headers['authorization'].split(' ');
      const token = tokenArray[1];
      const decodedToken = await this.authService.verifyJwt(token);
      const user: User = await this.userService.getUserById(
        decodedToken.user.id,
      );
      if (user) {
        req.user = user;
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
