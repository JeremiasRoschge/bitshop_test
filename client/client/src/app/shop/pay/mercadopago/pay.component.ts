import { Component, OnInit } from '@angular/core';
import { MercadoPagoService } from './service/mercadopago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent implements OnInit {
  qrData: string = '';
  showQrAnimation: boolean = false;

  constructor(private mercadoPagoService: MercadoPagoService) {}

  ngOnInit(): void {
    this.mostrarAlertaCarga();
  }

  async mostrarAlertaCarga() {
    let timerInterval: NodeJS.Timeout | null = null;
    
    // Muestra la alerta de carga
    await Swal.fire({
      title: 'Generando su código QR',
      html: 'Aguarde hasta que la pestaña se cierre!',
      timer: 2002,
      timerProgressBar: true,
      didOpen: async () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector('b');
        if (timer) {
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        }
      },
      willClose: async () => {
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        // Cierra la alerta antes de continuar con la generación del QR
        await Swal.close();
        
        // Genera el QR después de cerrar la alerta
        this.showQrAnimation = true;
      },
      didClose: async () => {
        await this.crearPago();
      }
    });
  }

  async crearPago() {
    // Genera el QR
    await this.mercadoPagoService.crearQR();

    // Después de generar el QR, obtén la data y actualiza el componente
    this.obtenerQRData();
  }

  obtenerQRData(): void {
    this.qrData = sessionStorage.getItem('qrData') || '';
  }
}
