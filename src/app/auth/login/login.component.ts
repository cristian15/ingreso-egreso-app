import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  constructor(private fb: FormBuilder
              , private authService: AuthService
              , private router: Router
    
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [ Validators.required]],
    });
  }

  login(){

    if(this.loginForm.invalid){return;}

    Swal.fire({
      title: 'Espere Porfavor',
      didOpen: ()=>{
        Swal.showLoading()
      }
    });

    const {email, password} = this.loginForm.value;
    this.authService.loginUsuario(email, password)
        .then(credenciales=>{
          Swal.close()
          this.router.navigate(['/dashboard'])
          console.log(credenciales);
        })
        .catch(err=>{
          
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        });

  }

}
