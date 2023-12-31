import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private readonly apiUrl = 'https://api.mercadopago.com/checkout/preferences';
  private readonly accessToken =
    'TEST-3358495821578994-112023-573081783ade7865dbc9fe453583deb8-1371791655';

  constructor(private http: HttpClient) {}

  realizarPago() {
    // Obtén los datos necesarios del sessionStorage
    const carritoString = sessionStorage.getItem('compras');
    let carrito: any[] = [];
    if (carritoString) {
      carrito = JSON.parse(carritoString);
    }

    const productosString = sessionStorage.getItem('productos');
    let productos: any[] = [];
    if (productosString) {
      productos = JSON.parse(productosString);
    }

    const descripcion = carrito
      .map((item) => {
        const producto = productos.find((p) => p.id === item.id_prod);
        return producto ? producto.nombre : ''; 
      })
      .join(', ');
    const precioTotal = carrito.reduce(
      (total, carrito) => total + carrito.gastos,
      0
    );
    const cantidadTotal = carrito.reduce(
      (total, carrito) => total + carrito.cantidad,
      0
    );

    const unitPrice = precioTotal / cantidadTotal;

    // Datos para la solicitud
    const requestData = {
      items: [
        {
          title: 'Cantina Bitshop',
          description: descripcion,
          unit_price: unitPrice,
          currency_id: 'ARS',
          quantity: cantidadTotal,
        },
      ],

      transaction_amount: precioTotal,
      notification_url:
        'https://340d-190-109-126-187.ngrok-free.app/api/webhook/receive',
      back_urls: {
        success: 'http://localhost:4200/admin/employee',
        // pending: 'https://e720-190-237-16-208.sa.ngrok.io/pending',
        // failure: 'https://e720-190-237-16-208.sa.ngrok.io/failure',
      },
    };

    // Configura las cabeceras de la solicitud
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    // Realiza la solicitud a la API de Mercado Pago
    this.http.post(this.apiUrl, requestData, { headers }).subscribe(
      (response) => {
        // Maneja la respuesta según tus necesidades
        console.log(response);
        
      },
      (error) => {
        // Maneja los errores según tus necesidades
        console.error('Error en la solicitud HTTP:', error);
      }
    );
  }
}