import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { interval, Subscription , Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private componentDestroyed$ = new Subject<void>();
  private readonly localApiUrl = 'https://dev1.bitsion.com:61092/api/api/mercadopago/realizarPedido';
  private pollingInterval = 7000;
  private maxPollingAttempts = 10;
  private continuePolling = true;

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

      const precioTotal = carrito.reduce((total, carrito) => total + carrito.gastos, 0);

      const localApiRequestData = {
        cash_out: {
          amount: 0,
        },
        external_reference: 'reference_12345',
        items: [
          {
            sku_number: 'A123K919198',
            category: 'marketplace',
            title: 'Cantina Bitshop',
            description: descripcion,
            unit_price: precioTotal,
            quantity: 1,
            unit_measure: 'unit',
            total_amount: precioTotal,
          },
        ],
        notification_url: 'https://ea00-186-158-234-53.ngrok-free.app/api/webhook/receive',
        sponsor: {
          id: 446566691,
        },
        title: 'Cantina Bitshop',
        description: 'Cantina Bitshop!',
        total_amount: precioTotal,
      };

      const localApiHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response: any = await this.http.post(this.localApiUrl, localApiRequestData, { headers: localApiHeaders }).toPromise();

      console.log('Respuesta del backend local:', response);

      const qrData = response?.qr_data;

      if (qrData) {
        sessionStorage.setItem('qrData', qrData);

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

  private precomprasUrl = 'https://dev1.bitsion.com:61092/api/api/webhook/addtodb';
  private precomprasHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });


  postPrecomprasToServer(precomprasData: any[]): void {
    this.continuePolling = true; // Reinicia la variable
    this.poll(precomprasData, 1);
  }

  private poll(precomprasData: any[], attempt: number): void {
    if (!this.continuePolling || attempt > this.maxPollingAttempts) {
      console.log('Deteniendo el polling.');
      return;
    }

    this.sendRequest(precomprasData, attempt);

    setTimeout(() => {
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
