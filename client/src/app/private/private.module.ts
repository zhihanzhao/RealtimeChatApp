import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PrivateRoutingModule } from './private-routing.module';
import { MaterialModule } from '../material/material.module';
import { CreatRoomComponent } from './components/creat-room/creat-room.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomepageComponent, CreatRoomComponent, SelectUserComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [HomepageComponent]
})
export class PrivateModule { }
