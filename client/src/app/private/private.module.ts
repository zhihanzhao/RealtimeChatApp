import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PrivateRoutingModule } from './private-routing.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MaterialModule
  ],
  exports: [HomepageComponent]
})
export class PrivateModule { }
