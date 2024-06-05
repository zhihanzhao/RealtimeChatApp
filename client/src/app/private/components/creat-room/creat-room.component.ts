import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-creat-room',
  templateUrl: './creat-room.component.html',
  styleUrls: ['./creat-room.component.scss'],
})
export class CreatRoomComponent {
  inputTestUser : UserI = {id:123, username:'input'}
  inputTest : FormControl = new FormControl(this.inputTestUser);
  form: FormGroup = new FormGroup(
    { name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      users: new FormArray([this.inputTest],[Validators.required])
    }
  );
  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }
  constructor() {}

  initUserFC( user :UserI) {
    return new FormControl({
      id: user.id,
      username: user.username,
      email: user.email
    })
  }

  addUser( user : FormControl){
    console.log("chat room form add User", typeof(user), user.value);
    this.users.push(user);

  }

  removeUser( user: UserI){
    console.log("chat room form remove User");
    const targetIndex = this.users.value.findIndex((u: UserI) => u === user);
    this.users.removeAt(targetIndex);
  }

  create(){
    console.log(
      `create new chat room,
      ${this.name.value}`
    );
    console.log("description", this.description.value);
    console.log("users", this.users.value);
    this.users.clear();

  }
}
