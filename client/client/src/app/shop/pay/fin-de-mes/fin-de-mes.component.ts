import { Component, OnInit } from '@angular/core';
import { Compra } from '../../../admin/compra-dt/services/models/compra';
import { FinDeMesService } from './services/fin-de-mes.service';
import { generateUniqueId } from "./services/uniqueId";
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fin-de-mes',
  templateUrl: './fin-de-mes.component.html',
  styleUrls: ['./fin-de-mes.component.css']
})
export class FinDeMesComponent implements OnInit {

  constructor(private pagoService: FinDeMesService, private router: Router) {}

  ngOnInit(): void {
    this.comprar();
  }

  comprar() {
    const compraString = sessionStorage.getItem('precompras');

    if (compraString) {
      const precompras: Compra[] = JSON.parse(compraString);

      // Usar forkJoin para esperar a que todas las solicitudes se completen
      forkJoin(precompras.map(compra => this.pagoService.addCompra(compra)))
        .subscribe(
          () => {
            // Se ejecutará cuando todas las solicitudes hayan sido exitosas
            this.router.navigate(['/']);
            sessionStorage.clear();
          },
          error => {
            // Manejar errores aquí
            console.error('Error al realizar la compra:', error);
          }
        );
    } else {
      console.error('No hay datos en sessionStorage para realizar la compra.');
    }
  }
}
