import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PrivateRoutingModule } from './private-routing.module';
import { MaterialModule } from '../material/material.module';
import { CreatRoomComponent } from './components/creat-room/creat-room.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';


@NgModule({
  declarations: [HomepageComponent, CreatRoomComponent, SelectUserComponent, ChatRoomComponent, ChatMessageComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [HomepageComponent]
})
export class PrivateModule { }
