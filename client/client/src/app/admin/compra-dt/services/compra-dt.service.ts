import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompraDtService {
  private headers: HttpHeaders;
  constructor(private http:HttpClient) { 
    this.headers = new HttpHeaders({
      '__RequestVerificationSource': 'SrcRefM',
      '__RequestVerificationToken': 'Pe:Po',
    });
  }
  url:string = "https://dev1.bitsion.com:61092/api/api";
  

  getCompras(desde: string, hasta: string): Observable<any> {

    this.headers = this.headers.set('desde', desde);
    this.headers = this.headers.set('hasta', hasta);

    return this.http.get(this.url + "/compras/ObtenerCompras", { headers: this.headers });
  }

  getGastos(desde: string, hasta: string): Observable<any> {
    this.headers = this.headers.set('desde', desde);
    this.headers = this.headers.set('hasta', hasta);
    return this.http.get(this.url + "/compras/ObtenerGastos", { headers: this.headers})
  }

  getGastosEmpleado(cuil: number, fecha: any): Observable<any> {
    const [year, month] = fecha.split('-').map(Number);
    return this.http.get(this.url +`/compras/GastosFinDeMes/${cuil}/${year}/${month}`)
  }

}
