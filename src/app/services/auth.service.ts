import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription !: Subscription;
  private _user!: Usuario | null;

  constructor(public auth: AngularFireAuth
              , private firestore: AngularFirestore
              , private store: Store<AppState>
    ) { }

  crearUsuario(nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)
            .then(({user}) =>{
              const newUser = new Usuario(
                user!.uid,
                nombre,
                user!.email
              )
              return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
            });
  }

  loginUsuario(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if(fuser){
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
              .subscribe(fireStoreUser =>{
                const user = Usuario.fromFirebase(fireStoreUser);
                this._user = user;
                this.store.dispatch(authActions.setUser({user}));
              })
      }
      else{
        this._user= null;
        this.userSubscription?.unsubscribe();  // cancela subscripcion para no escuchar cuando sesion este cerrada
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(unSetItems());
      }
      
    })
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fuser => fuser != null)
    )
  }

  getUser(){
    return {...this._user}; // evita mutaciones
  }

}
