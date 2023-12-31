import { Component, OnInit } from '@angular/core';
import { PaycloudService } from './services/paycloud.service';
import { generateUniqueId } from "../mercadopago/service/uniqueId";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pay',
  templateUrl: './paycloud.component.html',
  styleUrls: ['./paycloud.component.css'],
})
export class PaycloudComponent implements OnInit {
  qrData: string = '';
  showQrAnimation: boolean = false;

  constructor(private paycloudService: PaycloudService) {}

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
        await this.crearPago();
      },
      didClose: async () => {
      }
    });
  }

  async crearPago() {
    // Genera el QR
    await this.paycloudService.crearQR();

    // Después de generar el QR, obtén la data y actualiza el componente
    this.obtenerQRData();
  }

  obtenerQRData(): void {
    this.qrData = sessionStorage.getItem('qrData') || '';
  }
}
