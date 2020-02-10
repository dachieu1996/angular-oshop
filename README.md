# Oshop

## Part 1-4: Create a new project

### Install Firebase Package
```
npm install -save firebase angularfire2
```
```js
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth'
```
```js
import { environment } from './../environments/environment';

imports: [
    ...
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
    ...
]
```

## Part 1-5: Installing Boostrap
```
npm i --save bootstrap 
```
style.css (3 ways to add bootstrap https://www.techiediaries.com/angular-bootstrap/)
```js
@import "~bootstrap/dist/css/bootstrap.css"
```

## Part 1-7: Defining the Routes
```js
import { RouterModule } from '@angular/router';

imports: [
    RouterModule.forRoot([
        { path:'', component: HomeComponent },
        { path:'products', component: ProductsComponent },
        { path:'shopping-cart', component: ShoppingCartComponent },
        { path:'check-out', component: CheckOutComponent },
        { path:'order-success', component: OrderSuccessComponent },
        { path:'login', component: LoginComponent },
        { path:'admin/products', component: AdminProductsComponent },
        { path:'admin/orders', component: AdminOrdersComponent },
    ])
]
```
app.component.html
```html
<bs-navbar></bs-navbar>

<main role="main" class="container">
  **<router-outlet></router-outlet>**
</main>
```
bs-navbar.component.html
```html
<li class="nav-item">
    <a class="nav-link" [routerLink]="['/']" routerLinkActive="router-link-active" >Home </a>
</li>
<li class="nav-item">
    <a class="nav-link" [routerLink]="['/shopping-cart']" routerLinkActive="router-link-active">Shopping Cart</a>
</li>
```

## Part 1-8: Adding a Drop-down Menu
```
npm install --save @ng-bootstrap/ng-bootstrap
```

## Part 1-11: Deployment
```
npm install -g firebase-tools
```
check version
```
firebase --version
```
```
firebase login
firebase init
```
firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
package.json
```json
"scripts": {
    "deploy:firebase": "ng build --prod && firebase deploy"
}
```
npm run deploy:firebase
```
