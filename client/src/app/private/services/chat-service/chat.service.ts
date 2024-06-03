import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  getMessage(): Observable<any> {
    console.log("chatservice: getMessage");
    return this.socket.fromEvent('message');
  }

  sendMessage(message : string){
    console.log("chatservice: sendMessage", message);
    this.socket.emit('message', message);
  }

  createRoom() {
    console.log("chatservice: createRoom");
    const user2: UserI = {
      id: 3
    };

    const room: RoomI = {
      name: 'Testroom',
      users: []      
    }

    this.socket.emit('createRoom', room);
  }

  getMyRooms(log: string) {
    console.log("chatservice: getMyRooms", log);
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  onConnect(): Observable<any>{
    console.log("chatservice: onConnect");
    return this.socket.fromEvent('connect');
  }

  onDisconnect(): Observable<any> {
    console.log("chatservice: onDisconnect");
    return this.socket.fromEvent('disconnect');
  }
}
