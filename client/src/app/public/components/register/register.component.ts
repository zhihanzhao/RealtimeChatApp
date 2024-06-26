import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../helper/custom-validators';
import { UserService } from '../../services/user-service/user.service';
import { UserI } from 'src/app/model/user.interface';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {


  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm : new FormControl(null, [Validators.required])
  }, {validators: CustomValidators.passwordMatching})

  constructor(private userService: UserService, private router: Router) { }


  ngOnInit(): void {
    console.log('RegisterComponent initialized');
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this.form.get('passwordConfirm') as FormControl;
  }

  register(){
    if(this.form.valid){
      let user : UserI = {
        email : this.email.value,
        username : this.username.value,
        password : this.password.value,
      }
      console.log("clicked register: ", user);
      this.userService.create(user).pipe(
        tap(() => this.router.navigate(['../login']))
      ).subscribe();
    }
  }

}
