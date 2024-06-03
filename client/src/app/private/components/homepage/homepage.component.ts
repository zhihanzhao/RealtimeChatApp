import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  constructor(private readonly chatService: ChatService){}
  rooms$: Observable<RoomPaginateI> | undefined;
  rooms: RoomI[] | undefined = [];;

  ngOnInit(): void {
    this.rooms$ = this.chatService.getMyRooms('constructor');
    this.chatService.createRoom();
    this.chatService.getMyRooms('ngOnit').subscribe(
    (res) => {
        console.log(res);
        this.rooms= res.items;
      } 
    )
  }

  

}
