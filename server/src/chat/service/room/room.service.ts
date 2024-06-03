import { Injectable, Logger, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/entity/room.entity';
import { Room } from 'src/chat/model/interfaces/room.interface';
import { User } from 'src/user/model/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
    this.logger.log('RoomService initialized');
  }

  async createRoom(room: Room, user: User): Promise<RoomEntity> {
    console.log(room);
    console.log(user);
    const newRoom = await this.addCreatorToRoom(room, user);
    console.log('createRoom in DB, save: ', newRoom);
    return this.roomRepository.save(newRoom);
  }

  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Room>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', { userId });

    return paginate(query, options);
  }

  async addCreatorToRoom(room: Room, user: User): Promise<Room> {
    room.users.push(user);
    return room;
  }
}
