import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from '../../shared/ui.actions';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm !: FormGroup;
  cargando: boolean = false;

  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder
              , private authService: AuthService
              , private router: Router
              , private store: Store<AppState>
    
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [ Validators.required]],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui=>{
      this.cargando = ui.isLoading;
      console.log('Cargando Subs');
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login(){

    if(this.loginForm.invalid){return;}


    this.store.dispatch(ui.isLoading());
    
    
    const {email, password} = this.loginForm.value;
    this.authService.loginUsuario(email, password)
    .then(credenciales=>{
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/dashboard'])
      console.log(credenciales);
    })
    .catch(err=>{          
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        });

  }

}
