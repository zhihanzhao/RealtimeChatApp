import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  constructor(private readonly chatService: ChatService){}
  title = this.chatService.getMessage();
  messages: string[] = [];

  ngOnInit(): void {
      this.chatService.getMessage().subscribe(
        (res: string[]) => {
          this.messages = res;
        }
      )
  }

  

}
