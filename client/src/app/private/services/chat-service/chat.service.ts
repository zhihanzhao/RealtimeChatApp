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
    // this.socket.emit('createRoom', room);
  }

  //why emit the rooms? not emit the rooms, it emits the parameters : limit,page
  emitPaginateRooms(limit: number, page: number) {
    console.log(`Fetch server emit the limit: ${limit}, page: ${page}`);
    this.socket.emit('paginateRooms', {limit, page});
  }

  getMyRooms() {
    console.log("chatservice: getMyRooms");
    this.socket.fromEvent<RoomPaginateI>('rooms').subscribe(
      (res) => {
        console.log("client get rooms: ", res);
      }
    );
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
