import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  url:string = "https://localhost:44344/api";

  getComprasPorUsuarioYFecha(cuil: number, year: number, month: number): Observable<any> {
    return this.http.get(`${this.url}/compras/ObtenerComprasPorUsuarioYFecha/${cuil}/${year}/${month}`);
  }
 
}
