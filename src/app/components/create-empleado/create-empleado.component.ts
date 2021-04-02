import { EmpleadoService } from './../../services/empleado.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.scss']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo: string = "Agregar Empleado";

  constructor(
    private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) {
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);

  }

  ngOnInit() {
    this.esEditar();
  }

  agregarEditarEmpleado() {
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return
    }
    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id)
    }
  }

  agregarEmpleado() {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    console.log(empleado);
    this.loading = true;

    this._empleadoService.agregarEmpleado(empleado).then(() => {
      // console.log("Empleado registrado");
      this.toastr.success("Empleado registrado con éxito", 'Empleado Registrado');
      this.router.navigate(['list-empleados']);
      this.loading = false;

    }).catch(error => {
      console.log(error);

    })

  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = "Editar Empleado";
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        // console.log(data);
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario']
        })
        this.loading = false;
      });
    }
  }

  editarEmpleado(id: string) {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado).then(()=>{
      this.loading = false;
      this.toastr.info('El empleado fue mofidicado con éxito', 'Empleado Modificado');
      this.router.navigate(['/list-empleados']);
    });

  }


}
