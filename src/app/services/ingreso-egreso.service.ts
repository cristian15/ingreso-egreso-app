import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  

  constructor(
        private firestore: AngularFirestore
        , private authService: AuthService 

    ) {
     }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ){

    delete ingresoEgreso.uid;
    return this.firestore.doc(`${this.authService.getUser().uid}/ingresos-egresos`)
              .collection('items')
              .add({...ingresoEgreso})
              // .add({descripcion: ingresoEgreso.descripcion, monto: ingresoEgreso.monto, tipo: ingresoEgreso.tipo})
  }

  initIngresosEgresosListener( uid: string ){
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => snapshot.map( doc =>{
            return { uid: doc.payload.doc.id, ...doc.payload.doc.data() as any }
          } )
        )
      );
  }

  borrarIngresoEgreso(uidItem: string){
    return this.firestore.doc(`${this.authService.getUser().uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
