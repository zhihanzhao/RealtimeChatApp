import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageI, MessagePaginateI } from 'src/app/model/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) {}

  getMessages(): Observable<MessagePaginateI> {
    return this.socket.fromEvent<MessagePaginateI>('messages');
  }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>('messageAdded');
  }

  sendMessage(message: MessageI) {
    console.log('chatservice: sendMessage', message);
    this.socket.emit('addMessage', message);
  }

  createRoom(room: RoomI) {
    console.log('chatservice: createRoom', room);
    this.socket.emit('createRoom', room);
    this.snackbar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  joinRoom(room: RoomI) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: RoomI) {
    this.socket.emit('leaveRoom', room);
  }

  //why emit the rooms? not emit the rooms, it emits the parameters : limit,page
  emitPaginateRooms(limit: number, page: number) {
    console.log(`Fetch server emit the limit: ${limit}, page: ${page}`);
    this.socket.emit('paginateRooms', { limit, page });
  }

  getMyRooms() {
    console.log('chatservice: getMyRooms');
    this.socket.fromEvent<RoomPaginateI>('rooms').subscribe((res) => {
      console.log('client get rooms: ', res);
    });
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  onConnect(): Observable<any> {
    console.log('chatservice: onConnect');
    return this.socket.fromEvent('connect');
  }

  onDisconnect(): Observable<any> {
    console.log('chatservice: onDisconnect');
    return this.socket.fromEvent('disconnect');
  }
}
