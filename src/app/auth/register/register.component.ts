import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as uiActions from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {


  registerForm !: FormGroup;
  uiSubscription !: Subscription;
  cargando: boolean = false;


  constructor(private fb: FormBuilder
              , private authService: AuthService  
              , private router: Router 
              , private store:Store<AppState>
    ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });


    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){

    if( this.registerForm.invalid){ return; }

    this.store.dispatch(uiActions.isLoading());

    const { nombre, correo, password} = this.registerForm.value;
    this.authService.crearUsuario(nombre, correo, password)
        .then(credenciales => {
          console.log(credenciales);
          this.store.dispatch(uiActions.stopLoading());
          this.router.navigate(['/dashboard'])
        })
        .catch(err=>{
          this.store.dispatch(uiActions.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        })
  }

}
