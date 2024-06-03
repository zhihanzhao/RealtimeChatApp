import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit{
  constructor(private readonly chatService: ChatService){
    console.log("constructor");
  }
  defultPageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  selectedRoom: RoomI | null = null;

  ngOnInit(): void {
    console.log("ngOnInit");
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    this.chatService.emitPaginateRooms(10, 0);
  }

  onPaginateRooms(pageEvent: PageEvent) {
    console.log("click the onPaginateRooms")
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

  onSelectRoom(event: MatSelectionListChange) {
    console.log("click the onSelectRoom")
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  

}
