import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { Observable } from 'rxjs';

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

  onConnect(): Observable<any>{
    console.log("chatservice: onConnect");
    return this.socket.fromEvent('connect');
  }

  onDisconnect(): Observable<any> {
    console.log("chatservice: onDisconnect");
    return this.socket.fromEvent('disconnect');
  }
}
