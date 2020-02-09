# Oshop

## Video part 1: Create a new project

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

})
```
