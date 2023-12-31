import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Employee } from '../models/employee';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly headers: HttpHeaders;
  constructor(private http:HttpClient) {
    this.headers = new HttpHeaders({
      '__RequestVerificationSource': 'SrcRefM',
      '__RequestVerificationToken': 'Pe:Po',
    });
  }

  url:string = "https://dev1.bitsion.com:61092/api/api";


  getEmployee(): Observable<any> {
    return this.http.get(this.url + "/empleados/ObtenerEmpleado", { headers: this.headers });


  }

  addEmployee(employee: Employee): Observable<Employee | boolean> {
    return this.http.post<Employee>(`${this.url}/empleados/AgregarEmpleado`, employee, { headers: this.headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // El PIN ya existe, maneja el error aquí
            return of(false);
          }
          // Manejo de otros errores
          return throwError('Error del servidor.');
        })
      );
  }

  updateEmployee(cuil: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.url + '/empleados/UpdateEmployee' + `/${cuil}`, employee, { headers: this.headers });
  }

  deleteEmployee(cuil: number) {
    return this.http.delete(this.url + '/empleados/deleteByCuilEmployee' +`/${cuil}`, { headers: this.headers });
  }
}
