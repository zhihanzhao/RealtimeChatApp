import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Observable, from, map, switchMap } from 'rxjs';
import { User } from '../model/interfaces/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { UserService } from '../service/user/user.service';
import { UserHelperService } from '../service/user.helper/user.helper.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { access } from 'fs';
import { LoginResponse } from '../model/interfaces/login-response.interface';

@Controller('users')
export class UserController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  // @UseGuards(JwtGuard)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return from(
      this.userService.findAll({
        page,
        limit,
        route: '/users',
      }),
    );
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<User> {
    return from(
      this.userHelperService.createUserDtoToEntity(createUserDto),
    ).pipe(
      switchMap((user: User) => {
        return this.userService.create(user);
      }),
    );
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Observable<LoginResponse> {
    return from(this.userHelperService.loginUserDtoToEntity(loginUserDto)).pipe(
      switchMap((user: User) => {
        return this.userService.login(user).pipe(
          map((jwt: string) => {
            return {
              access_token: jwt,
              token_type: 'JWT',
              expires_in: 10000,
            };
          }),
        );
      }),
    );
  }
}
