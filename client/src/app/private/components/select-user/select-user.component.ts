import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, from, map, of, startWith, switchMap, tap } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnChanges{
  @Input() selectedUsers: UserI[] = [];
  @Output() adduser: EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() removeuser: EventEmitter<UserI>= new EventEmitter<UserI>();

  searchUsersControl: FormControl = new FormControl();
  filteredUsers: Observable<UserI[]> | undefined;
  selectedUser: UserI | undefined = undefined;

  constructor(private readonly userService: UserService){}

  ngOnInit() {
    console.log("ngOnInit Select User");
    this.filteredUsers = this.searchUsersControl.valueChanges.pipe(
      startWith(''),
      switchMap((username: string) => {
        debounceTime(500),
        distinctUntilChanged(),
        console.log("input value changed : ", username);
        return this.userService.getAllByUsername(username);
      })
    );
  }

  ngOnChanges(){
    console.log("ngOnInit SelectedUsersList:", this.selectedUsers);
  }

  setSelectedUser(selected : UserI){
    console.log("selected user: ", selected);
    this.selectedUser = selected;
  }

  addUserToForm(){
    this.adduser.emit(this.selectedUser);
    // this.filteredUsers = from([]);
    this.selectedUser = undefined;
    this.searchUsersControl.setValue(null);
  }

  removeUserFromForm(rmUser : UserI){
    this.removeuser.emit(rmUser);
  }

  displayFn(user: UserI): string {
    if(user && typeof user.username === 'string'){
      return user.username;
    } else {
      return '';
    }
  }
  
}
