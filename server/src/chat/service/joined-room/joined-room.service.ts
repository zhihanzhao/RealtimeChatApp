import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/entity/joinedRoom.entity';
import { JoinedRoom } from 'src/chat/model/interfaces/joinedRoom,interface';
import { Room } from 'src/chat/model/interfaces/room.interface';
import { User } from 'src/user/model/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: JoinedRoom): Promise<JoinedRoom> {
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: User): Promise<JoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { user } });
  }

  async findByRoom(room: Room): Promise<JoinedRoom[]> {
    const result = await this.joinedRoomRepository.find({ where: { room } })
    return this.joinedRoomRepository.find({ where: { room } });
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
