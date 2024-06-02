import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { LoginResponseI } from 'src/app/model/login-response.interface';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private snackbar: MatSnackBar
  ) {}
  
  login(user: UserI){
    return this.http.post<LoginResponseI>('/api/users/login', user).pipe(
      tap( resposne => {
        localStorage.setItem('nestjs_chat_app', resposne.access_token);
      }),
      tap(() => this.snackbar.open(
        'Login Successfull',
        'Close',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      )),
      catchError( e => {
        this.snackbar.open(
          `${e.error.message}`,
          'Close',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        )
        throw new Error(e.error.message);
      }),
    )
  }
}
