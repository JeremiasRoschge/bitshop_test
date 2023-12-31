import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Product, ProductUpdate } from '../models/product';
import { tap, catchError, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly headers: HttpHeaders;
  constructor(private http:HttpClient, private storage: AngularFireStorage) { 
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationSource': 'SrcRefM',
      '__RequestVerificationToken': 'Pe:Po',
    });
  }

  url:string = "https://dev1.bitsion.com:61092/api/api";
  

  getProduct(): Observable<any> {
    return this.http.get(this.url + "/productos/ObtenerProducto", { headers: this.headers });
  }

  addProduct(producto: Product): Observable<Product | boolean> {
    return this.http.post<Product>(this.url + '/productos/AgregarProducto', producto, { headers: this.headers })
      .pipe(
        tap(response => console.log('Respuesta del servidor:', response)),
        catchError((error: HttpErrorResponse) => {
          console.error('Error del servidor:', error);
          return throwError('Error del servidor.');
        })
      );
  }

  uploadImage(file: File): AngularFireUploadTask {
    const path = `images/${file.name}`;
    const task = this.storage.upload(path, file);
    return task;
  }
  
  getImageUrl(path: string): Observable<string | null> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }

  updateProduct(id: number, product: ProductUpdate): Observable<ProductUpdate> {
    return this.http.put<ProductUpdate>(`${this.url}/productos/ActualizarProducto/${id}`, product, { headers: this.headers })
      .pipe(
        tap((response: ProductUpdate) => console.log('Respuesta de actualización:', response)),
        catchError((error: any) => {
          throw error;
        })
      );
  }
  

  deleteProduct(id: number) {
    return this.http.delete(this.url + '/productos/EliminarProducto' +`/${id}`, { headers: this.headers });
  }
}