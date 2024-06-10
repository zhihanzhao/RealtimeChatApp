import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/entity/room.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/entity/connectedUser.entity';
import { MessageEntity } from './model/entity/message.entity';
import { MessageService } from './service/message/message.service';
import { JoinedRoomEntity } from './model/entity/joinedRoom.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      MessageEntity,
      JoinedRoomEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    RoomService,
    ConnectedUserService,
    MessageService,
    JoinedRoomService,
  ],
})
export class ChatModule {}
