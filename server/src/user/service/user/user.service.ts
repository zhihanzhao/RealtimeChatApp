import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Observable, from, map, switchMap } from 'rxjs';
import { Like, Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/entity/user.entity';
import { User } from 'src/user/model/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async create(newUser: User): Promise<User> {
    const isEmailExist: boolean = await this.checkEmailExists(newUser.email);
    const isUsernameExist: boolean = await this.checkUsernameExists(
      newUser.username,
    );
    if (!isEmailExist && !isUsernameExist) {
      const passwordHash: string = await this.authService.hashPassword(
        newUser.password,
      );
      newUser.password = passwordHash;
      const createdUser: User = await this.userRepository.save(newUser);
      return this.findbyId(createdUser.id);
    } else {
      const errorMsg = isEmailExist
        ? 'Email is already in use'
        : 'Username is already in use';
      throw new HttpException(errorMsg, HttpStatus.CONFLICT);
    }
  }

  async login(user: User): Promise<string> {
    const foundUser: User = await this.findByEmail(user.email);
    if (foundUser) {
      const isMatches: boolean = await this.authService.validatePassword(
        user.password,
        foundUser.password,
      );
      if (isMatches) {
        const payload: User = await this.findbyId(foundUser.id);
        return this.authService.generateJwt(payload);
      } else {
        throw new HttpException(
          'Login was not successfull, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async findAllByUsername(username: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  public getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    return Boolean(foundUser);
  }

  private async checkUsernameExists(username: string): Promise<boolean> {
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    return Boolean(foundUser);
  }

  private findbyId(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }
}
