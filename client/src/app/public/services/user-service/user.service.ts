import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private snackbar: MatSnackBar
  ) {}

  create(user: UserI): Observable<UserI> {
    console.log(user);
    return this.http.post<UserI>('api/users', user).pipe(
      tap(createdUser => {
        console.log(createdUser);
        return this.snackbar.open(
          `User ${createdUser.username} created successfully`,
          'Close',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        )
      }),
      catchError(e => {
        console.log(e);
        this.snackbar.open(
          `User could not be created, due to: ${e.error.message}`,
          'Close',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        )
        return throwError(() => new Error(e.error));
      } )
    )

  }


}
