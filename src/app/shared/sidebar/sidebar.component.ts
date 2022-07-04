import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  email: string = '';

  userSubs !: Subscription;
  constructor(private authService: AuthService
            , private route: Router
            , private store: Store<AppState>
    ) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
      .pipe(
        filter(({user})=> user !=null)
      )
      .subscribe(({user}) =>{
        console.log(user);
        this.nombre = user?.nombre;
        this.email = user?.email;
      })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }


  logout(){
    this.authService.logout().then(()=>{
      this.route.navigate(['/login']);
    });
  }

}
