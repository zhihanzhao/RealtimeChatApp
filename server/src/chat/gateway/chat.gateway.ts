import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user/user.service';

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
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.title.push('Value' + Math.random().toString());
      this.server.emit('message', this.title);
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
}
