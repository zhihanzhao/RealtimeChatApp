import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //can update to async validators
  
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email]),
    password: new FormControl(null, []),
  });

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  login() {
    const user = {
      email: this.email.value,
      password: this.password.value,
    };
    console.log('login', user);
    this.authService
      .login(user)
      .pipe(tap(() => {
        console.log("redirect to private");
        this.router.navigate(['../../private/home']);
      }))
      .subscribe();
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }
}
