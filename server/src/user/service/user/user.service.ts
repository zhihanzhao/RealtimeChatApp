import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Observable, from, map, switchMap } from 'rxjs';
import { UserEntity } from 'src/user/model/user.entity';
import { User } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  create(newUser: User): Observable<User> {
    return this.checkEmailExists(newUser.email).pipe(
      switchMap((exist: boolean) => {
        //aviod duplicated email
        if (!exist) {
          //hash password
          return this.authService.hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              newUser.password = passwordHash;
              //save the user in db
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: User) => {
                  console.log(typeof user);
                  console.log(user);
                  //return the user
                  return this.findOne(user.id);
                }),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  login(user: User): Observable<string> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: User) => {
        if (foundUser) {
          return this.authService
            .validatePassword(user.password, foundUser.password)
            .pipe(
              switchMap((matches: boolean) => {
                if (matches) {
                  //generate and return jwt token
                  return this.findOne(foundUser.id).pipe(
                    switchMap((payload: User) => {
                      return this.authService.generateJwt(payload);
                    }),
                  );
                } else {
                  throw new HttpException(
                    'Login was not successfull, wrong credentials',
                    HttpStatus.UNAUTHORIZED,
                  );
                }
              }),
            );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  private checkEmailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((user: User) => {
        return Boolean(user);
      }),
    );
  }

  private findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } }));
  }

  private findByEmail(email: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'username', 'password'],
      }),
    );
  }
}
