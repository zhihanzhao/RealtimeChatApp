import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "./components/homepage/homepage.component";
import { CreatRoomComponent } from "./components/creat-room/creat-room.component";

const routes: Routes = [
    {
        path: 'home', component: HomepageComponent
    },
    {
        path: 'create-room', component: CreatRoomComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateRoutingModule{

}