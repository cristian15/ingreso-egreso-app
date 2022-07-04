import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {


  userSubscription !: Subscription;
  ingresosSubscription !: Subscription;

  constructor( private store: Store<AppState> 
          , private ingreosEgresosService: IngresoEgresoService      
    ) { }

  ngOnInit(): void {

    console.log("HOLA DASH")

    this.userSubscription = this.store.select('user')
      .pipe(
        filter(  auth => auth.user != null )
      )
      .subscribe(({user})=>{
      this.ingresosSubscription = this.ingreosEgresosService.initIngresosEgresosListener(user?.uid)
          .subscribe(ingresosEgresosFB=>{       
            this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}))
            console.log(ingresosEgresosFB);
      })
    });
  }

  ngOnDestroy(): void {
    this.ingresosSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

}
