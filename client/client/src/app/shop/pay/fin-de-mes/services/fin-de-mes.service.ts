import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Compra } from "../../../../admin/compra-dt/services/models/compra";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinDeMesService {

  private readonly headers: HttpHeaders;
  constructor(private http:HttpClient) { 
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationSource': 'SrcRefM',
      '__RequestVerificationToken': 'Pe:Po',
    });
  }

  url:string = "https://dev1.bitsion.com:61092/api/api";

  addCompra(compra: Compra): Observable<Compra | boolean> {
    return this.http.post<Compra>(this.url + '/compras/AgregarCompra', compra, { headers: this.headers })
      .pipe(
        tap(response => console.log('Respuesta del servidor:', response)),
        catchError((error: HttpErrorResponse) => {
          console.error('Error del servidor:', error);
          return throwError('Error del servidor.');
        })
      );
  }


}
