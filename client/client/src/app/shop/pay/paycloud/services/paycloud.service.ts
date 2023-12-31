import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { interval, Subscription , Subject } from 'rxjs';
import { generateUniqueId } from "../../mercadopago/service/uniqueId";
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaycloudService {
  private componentDestroyed$ = new Subject<void>();
  private readonly localApiUrl = 'https://dev1.bitsion.com:44344/api/api/paycloud/crearQR';
  private pollingInterval = 10000;
  private maxPollingAttempts = 15;
  private continuePolling = true;
  private pollTimer: any;

  constructor(private http: HttpClient, private router : Router) {}

  async crearQR(): Promise<any> {
    try {
      const carritoString = sessionStorage.getItem('precompras');
      const productosString = sessionStorage.getItem('productos');

      if (!carritoString || !productosString) {
        console.error('Error: No se encontró información del carrito o productos en sessionStorage');
        return Promise.reject('Error: No se encontró información del carrito o productos en sessionStorage');
      }

      const carrito: any[] = JSON.parse(carritoString);
      const productos: any[] = JSON.parse(productosString);

      const descripcion = carrito
        .map((item) => {
          const producto = productos.find((p) => p.id === item.id_prod);
          return producto ? producto.nombre : '';
        })
        .join(', ');

      var reference = generateUniqueId();
      const precioTotal = carrito.reduce((total, carrito) => total + carrito.gastos, 0);

      const localApiRequestData = {
        Amount: precioTotal,
        TributaryIdentifier: 27422125073,
        Cvu: "0000247100000000014096",
        ReferenceExternal: reference,
        ExpirationMinute: "10",
        System: "kioscobitsion",
        Title: descripcion
    };

      const localApiHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response: any = await this.http.post(this.localApiUrl, localApiRequestData, { headers: localApiHeaders }).toPromise();

      console.log('Respuesta del backend local:', response);

      const qrUrl = response?.data?.qr;

      if (qrUrl) {
        sessionStorage.setItem('qrData', qrUrl);
        console.log(qrUrl)

        // Obtener los datos de precompras de sessionStorage
        const precompras: any[] = JSON.parse(sessionStorage.getItem('precompras') || '[]');

        // Realizar el segundo POST con los datos de precompras al servidor
        this.postPrecomprasToServer(precompras);
      } else {
        console.error('Error: No se pudo obtener el ID de la preferencia del backend local');
      }

      return response;
    } catch (error) {
      console.error('Error en la generación del QR:', error);
      throw error;
    }
  }

  private precomprasUrl = 'https://dev1.bitsion.com:61092/api/api/paycloud/addtodb';
  private precomprasHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });


  postPrecomprasToServer(precomprasData: any[]): void {
    this.continuePolling = true; // Reinicia la variable de estado
    this.poll(precomprasData, 1);
  }

  private poll(precomprasData: any[], attempt: number): void {
    if (!this.continuePolling || attempt > this.maxPollingAttempts) {
      console.log('Deteniendo el polling.');
      return;
    }

    this.sendRequest(precomprasData, attempt);

    // Limpiar el temporizador existente antes de iniciar uno nuevo
    clearTimeout(this.pollTimer);

    this.pollTimer = setTimeout(() => {
      this.poll(precomprasData, attempt + 1);
    }, this.pollingInterval);
  }

  private sendRequest(precomprasData: any[], attempt: number): void {
    this.http.post(this.precomprasUrl, precomprasData, { headers: this.precomprasHeaders }).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor al agregar precompras a la base de datos:', response);

        if (response === true) {
          console.log('Operación permitida, el estado del pago es "closed". Deteniendo el polling.');
          this.continuePolling = false;
        } else {
          console.error('Error: El estado del pago no es "closed". Intentando nuevamente...');
        }
      },
      (error) => {
        console.error('Error al agregar precompras a la base de datos:', error);
        console.log(`Intentando nuevamente... (Intento ${attempt})`);
      }
    );
  }


  private retry(precomprasData: any[], attempt: number): void {
    if (attempt < this.maxPollingAttempts) {
      // Intenta nuevamente después de un tiempo
      console.log(`Intentando nuevamente... (Intento ${attempt})`);
      setTimeout(() => {
        this.sendRequest(precomprasData, attempt + 1);
      }, this.pollingInterval);
    } else {
      console.log('Número máximo de intentos alcanzado. Deteniendo el polling.');
      this.stopPolling();
    }
  }

  private stopPolling(): void {
    this.continuePolling = false;
    console.log('Deteniendo el polling.');
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


}
