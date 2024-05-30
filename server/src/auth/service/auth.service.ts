import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { User } from 'src/user/model/user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    const result = bcrypt.compare(password, storedPasswordHash);
    return from(bcrypt.compare(password, storedPasswordHash));
  }
}
