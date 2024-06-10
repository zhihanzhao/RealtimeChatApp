import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { User } from 'src/user/model/interfaces/user.interface';
import { UserService } from 'src/user/service/user/user.service';
import { RoomService } from '../service/room/room.service';
import { Room } from '../model/interfaces/room.interface';
import { Page } from '../model/interfaces/page.interface';
import { ConnectedUser } from '../model/interfaces/connectedUser.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { Message } from '../model/interfaces/message.interface';
import { MessageService } from '../service/message/message.service';
import { JoinedRoom } from '../model/interfaces/joinedRoom,interface';
import { JoinedRoomService } from '../service/joined-room/joined-room.service';
import { aborted } from 'util';

@WebSocketGateway({
  cors: {
    origin: [
      [
        'https://hoppscotch.io',
        'http://localhost:3000',
        'http://localhost:4200',
      ],
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  title: string[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly messageService: MessageService,
    private readonly joinedRoomSerivce: JoinedRoomService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

  async handleConnection(client: Socket) {
    console.log('handleConnection');
    try {
      const detoken = await this.authService.verifyJwt(
        client.handshake.headers.authorization,
      );
      const currentUser: User = await this.userService.getUserById(
        detoken.user.id,
      );
      if (!currentUser) {
        client.disconnect();
      } else {
        client.data.user = currentUser;
        console.log('handleConnection: sign the user', client.data.user);
        const rooms = await this.roomService.getRoomsForUser(currentUser.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        await this.connectedUserService.create({
          socketId: client.id,
          user: currentUser,
        });

        this.server.to(client.id).emit('rooms', rooms);
      }
    } catch (error) {
      client.emit('Error', new UnauthorizedException());
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(client: Socket) {
    await this.joinedRoomSerivce.deleteBySocketId(client.id);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, room: Room) {
    const roomMessages = await this.messageService.findMessageFromRoom(room, {
      limit: 10,
      page: 1,
    });
    roomMessages.meta.currentPage = roomMessages.meta.currentPage - 1;
    await this.joinedRoomSerivce.create({
      socketId: client.id,
      user: client.data.user,
      room: room,
    });
    await this.server.to(client.id).emit('messages', roomMessages);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(client: Socket, room: Room) {
    const user = client.data.user;
    console.log('onCreateRoom, check the user', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const createdRoom: Room = await this.roomService.createRoom(
      room,
      client.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: ConnectedUser[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(client: Socket, page: Page) {
    const rooms = await this.roomService.getRoomsForUser(
      client.data.user.id,
      this.handleIncomingPageRequest(page),
    );
    console.log('server get the room from DB', rooms.meta.currentPage);

    // substract page -1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(client.id).emit('rooms', rooms);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(client: Socket, message: Message) {
    const createdMessage: Message = await this.messageService.create({
      ...message,
      user: client.data.user,
    });
    const room: Room = await this.roomService.getRoom(createdMessage.room.id);
    // eslint-disable-next-line prettier/prettier
    const joinedUsers: JoinedRoom[] = await this.joinedRoomSerivce.findByRoom( room );
    //TODO: Send new message to all connected-Users(user&clientid) of the room(currently online)
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: Page) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
