import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/model/entity/message.entity';
import { Message } from 'src/chat/model/interfaces/message.interface';
import { Room } from 'src/chat/model/interfaces/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: Message): Promise<Message> {
    const createdMessage = this.messageRepository.create(message);
    return this.messageRepository.save(createdMessage);
  }

  async findMessageFromRoom(
    room: Room,
    options: IPaginationOptions,
  ): Promise<Pagination<Message>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC');

    return paginate(query, options);
  }
}
