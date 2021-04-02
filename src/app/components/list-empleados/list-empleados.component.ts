import { element } from 'protractor';
import { EmpleadoService } from './../../services/empleado.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.scss']
})
export class ListEmpleadosComponent implements OnInit {
  empleados: any[] = [];

  constructor(
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService

    ) {
    // this.empleados = firestore.collection('empleados').valueChanges();
  }

  ngOnInit() {
    this.getEmpleados();
  }

  getEmpleados() {
    this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) => {

        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.empleados);


    })
  }

  eliminarEmpleado(id: string) {
    this._empleadoService.eliminarEmpleado(id).then(()=>{
      console.log("empleado eliminado");
      this.toastr.error('El empleado fue eliminado con éxito', 'Registro Eliminado');
      
    }).catch(error =>{
      console.log(error);
      
    });

  }

}
