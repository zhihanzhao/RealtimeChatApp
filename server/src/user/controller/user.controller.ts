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
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get('/find-by-username')
  async findAllByUsername(@Query('username') username: string) {
    return this.userService.findAllByUsername(username);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userHelperService.createUserDtoToEntity(
      createUserDto,
    );
    return this.userService.create(user);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const loginUser = await this.userHelperService.loginUserDtoToEntity(
      loginUserDto,
    );
    const jwt = await this.userService.login(loginUser);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000,
    };
  }
}
