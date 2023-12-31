import { Component, OnInit } from '@angular/core';
import { Employee } from './models/employee';
import { EmployeeService } from './services/employee.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employee: Employee = new Employee();
  datatable: any = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.onDataTable();
    console.log(this.employee.role)
  }
//VALIDACIONES PARA EL MODEL EMPLEADO
  validateCuil(cuil: number): boolean {
    const cuilString = cuil.toString();
  
    if (cuilString.length !== 11) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El CUIL ingresado es menor a 11 caracteres!"
      });
      return false;
    }
  
    return true;
  }

  validateNombre(nombre: string): boolean {
    if (!nombre) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre no puede estar vacío!"
      });
      return false;
    }
    return true;
  }

  validatePin(pin: any): boolean {
    if (pin.length !< 4) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El PIN debe tener 4 caracteres!"
      });
      return false;
    }
    return true;
  }

  validateEmployee(employee: Employee): boolean {
    return (
      this.validateCuil(employee.cuil) &&
      this.validateNombre(employee.nombre_completo) &&
      this.validatePin(employee.pin)
    );
  }

  //METODOS (GET, PUT, POST Y DELETE)
  onDataTable(): void {
    this.employeeService.getEmployee().subscribe((res) => {
      this.datatable = res;
      console.log(res);
    });
  }

  onAddEmployee(employee: Employee): void {
   if(this.validateEmployee(employee)) {
    this.employeeService.addEmployee(employee).subscribe((res) => {
      if (res) {
        Swal.fire({
          title: "Nuevo empleado agregado!",
          text: `El empleado ${employee.nombre_completo} se ha registrado con éxito!`,
          icon: "success"
        });
        this.clear();
        this.onDataTable();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El CUIL o PIN ya existen en la base de datos. Intenta uno nuevo!"
        });
      }
    });
   }
  }

  onUpdateEmployee(employee: Employee): void {
    if (!this.validateEmployee(employee)) {
      return;
    }
  
    Swal.fire({
      title: "¿Estás seguro de modificar este empleado?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, modificarlo"
    }).then((result) => {
      if (result.isConfirmed) {
        // Usuario confirmó la modificación
        this.confirmedUpdate(employee.cuil, employee);
        console.log(employee)
      }
    });
  }
  
  private confirmedUpdate(cuil: number, employee: Employee): void {
    this.employeeService.updateEmployee(employee.cuil, employee).subscribe(
      () => {
        // Modificación exitosa
        Swal.fire({
          title: "Empleado modificado",
          text: `El empleado CUIL: ${employee.cuil} se ha modificado con éxito.`,
          icon: "success"
        });
        this.clear();
        this.onDataTable();
      },
      () => {
        // Manejo de errores
        Swal.fire({
          title: "Error!",
          text: "Algo salió mal.",
          icon: "error"
        });
      }
    );
  }

  onDeleteEmployee(cuil: number): void {
    if (!this.validateCuil(cuil)) {
      return;
    }
    Swal.fire({
      title: "¿Estas seguro de esto?",
      text: `¿Quieres eliminar a ${this.employee.nombre_completo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Usuario confirmó la eliminación
        this.confirmedDelete(cuil);
      }
    });
  }
  
  private confirmedDelete(cuil: number): void {
    this.employeeService.deleteEmployee(cuil).subscribe(
      () => {
        // Eliminación exitosa
        Swal.fire({
          title: "Empleado eliminado!",
          text: `El empleado ${this.employee.nombre_completo} ha sido eliminado exitosamente`,
          icon: "success"
        });
        this.clear();
        this.onDataTable();
      },
      () => {
        // Manejo de errores
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error"
        });
      }
    );
  }

  onSetData(select: any): void {
    this.employee.cuil = select.cuil;
    this.employee.nombre_completo = select.nombre_completo;
    this.employee.pin = select.pin;
    this.employee.role = select.role
  }

  clear(): void {
    this.employee.cuil = 0;
    this.employee.nombre_completo = '';
    this.employee.pin = 0;
    this.employee.role = 'Empleado'
  }
}