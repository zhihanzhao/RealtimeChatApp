import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from 'src/model/dto/create-user.dto';
import { LoginUserDto } from 'src/model/dto/login-user.dto';
import { User } from 'src/model/interfaces/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): Observable<User> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<User> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
