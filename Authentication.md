# Authentication and Authorization

## Part 2-2: Implementing Google login
```js
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'; 

export class LoginComponent{

  constructor(private afAuth: AngularFireAuth) { }

  login(){
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }
}
```

## Part 2-4: Display the Current User
```js
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

export class BsNavbarComponent {

  user: firebase.User;

  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => this.user = user)
  }
}
```
```html
<li *ngIf="!user" class="nav-item">
  <a class="nav-link" [routerLink]="['/login']" routerLinkActive="router-link-active">Login</a>
</li>
<li *ngIf="user" ngbDropdown class="nav-item dropdown">
  <a ngbDropdownToggle class="nav-link dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {{ user.displayName }}
  </a>
  <div ngbDropdownMenu class="dropdown-menu" aria-labelledby="dropdown01">
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/my/orders']" routerLinkActive="router-link-active" >My Orders</a>
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/admin/orders']" routerLinkActive="router-link-active" >Manager Orders</a>
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/admin/products']" routerLinkActive="router-link-active" >Manager Products</a>
    <a ngbDropdownItem class="dropdown-item" (click)="logout()" >Logout</a>
  </div>
</li>
```

## Part 2-3: Implement the Logout 
```js
export class BsNavbarComponent {
  logout(){
    this.afAuth.auth.signOut();
  }
}
```

## Part 2-5: Using the Async Pipe
```js
**import { Observable } from 'rxjs';**

export class BsNavbarComponent {

  user$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    **this.user$ = afAuth.authState;**
  }
}
```
```html
<ng-template #anonymousUser>
  <li class="nav-item">
    <a class="nav-link" [routerLink]="['/login']" routerLinkActive="router-link-active">Login</a>
  </li>
</ng-template>
<li *ngIf="user$ | async as user; else anonymousUser" ngbDropdown class="nav-item dropdown">
  <a ngbDropdownToggle class="nav-link dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {{ user.displayName }}
  </a>
  <div ngbDropdownMenu class="dropdown-menu" aria-labelledby="dropdown01">
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/my/orders']" routerLinkActive="router-link-active" >My Orders</a>
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/admin/orders']" routerLinkActive="router-link-active" >Manager Orders</a>
    <a ngbDropdownItem class="dropdown-item" [routerLink]="['/admin/products']" routerLinkActive="router-link-active" >Manager Products</a>
    <a ngbDropdownItem class="dropdown-item" (click)="logout()" >Logout</a>
  </div>
</li>
```

## Part 2-6: Extracting a Service
```js
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState;
   }

  login(){
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }

  logout(){
    this.afAuth.auth.signOut();
  }
}
```

## Part 2-7: Protecting the Routes
```
ng g s auth-guard
```
```js
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(){
    return this.authService.user$.pipe(map(user => {
      if(user) return true;

      this.router.navigate(['/login']);
      return false;
    }))

  }
}
```
```js
{ path:'check-out', component: CheckOutComponent, canActivate: [AuthGuard] }
```

## Part 2-8: Redirecting after Logging In
```js
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route, state: RouterStateSnapshot){
    return this.authService.user$.pipe(map(user => {
      if(user) return true;

      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }))

  }
}
```
```js
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router) {
    this.user$ = afAuth.authState;
   }

  login(){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }
}
```
```js
export class AppComponent implements OnInit {
  title = 'oshop';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.authService.user$.subscribe(user => {
      if(user){
        let returnUrl = localStorage.getItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      }
    })
  }
}
```

## Part 2-9: Storing Users in Firebase
Create UserService
```js
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  save(user: firebase.User){
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
  }
}
```
```js
export class AppComponent implements OnInit {
  title = 'oshop';
  constructor(private userService: UserService,private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.authService.user$.subscribe(user => {
      if(user){
        **this.userService.save(user);**

        let returnUrl = localStorage.getItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      }
    })
  }
}
```