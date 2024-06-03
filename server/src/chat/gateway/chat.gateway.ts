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
  ) {}

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
        this.server.to(client.id).emit('rooms', rooms);
      }
    } catch (error) {
      client.emit('Error', new UnauthorizedException());
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('createRoom')
  async onCreateRoom(client: Socket, room: Room): Promise<Room> {
    console.log('onCreateRoom');
    const user = client.data.user;
    console.log('onCreateRoom, check the user', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.roomService.createRoom(room, user);
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(client: Socket, page: Page) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    const rooms = await this.roomService.getRoomsForUser(
      client.data.user.id,
      page,
    );
    console.log('server get the room from DB', rooms.meta.currentPage);

    // substract page -1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(client.id).emit('rooms', rooms);
  }
}
