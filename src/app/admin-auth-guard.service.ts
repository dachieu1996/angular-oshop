import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard {

  constructor(private authService: AuthService, private userService: UserService) { }

  // canActivate(): Observable<boolean>{
  //   return this.authService.user$.pipe(
  //     switchMap(user => this.userService.get(user.uid)),
  //     map(appUser => appUser.isAdmin
  //   ))
  // }
}
