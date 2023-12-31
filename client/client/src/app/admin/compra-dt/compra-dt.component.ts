import { Component, OnInit} from '@angular/core';
import { CompraDtService } from './services/compra-dt.service';
import { Compra } from "./services/models/compra";
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";


@Component({
  selector: 'app-compra-dt',
  templateUrl: './compra-dt.component.html',
  styleUrls: ['./compra-dt.component.css'],
  providers:[DatePipe]
})
export class CompraDtComponent implements OnInit {
  gastos: any;
  compra: Compra = new Compra();
  desdeFecha: any;
  hastaFecha: any;
  datatable: any = [];
  searchTerm: string = '';
  
  constructor(private compraService: CompraDtService, private router: Router) {}

  ngOnInit(): void {
    this.onDataTable();
  }

  async onDataTable(): Promise<void> {
    const { value: dates } = await Swal.fire({
      title: "Seleccione la fecha para filtrar las compras",
      html: `
        <label for="startDate" class="form-label">Desde</label>
        <input id="startDate" type="date" class="form-control" required>
        <label for="endDate" class="form-label">Hasta</label>
        <input id="endDate" type="date" class="form-control" required>
      `,
      preConfirm: () => {
        const startDateInput = document.getElementById("startDate") as HTMLInputElement;
        const endDateInput = document.getElementById("endDate") as HTMLInputElement;
  
        return [startDateInput?.value, endDateInput?.value];
      }
    });
  
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];
      this.compraService.getCompras(startDate, endDate).subscribe((res) => {
        this.datatable = res;
    });
  }
  }
  
  


  buscarGastos(): void {
    const fecha = this.compra.fechaSeleccionada
    this.compraService.getGastosEmpleado(this.compra.cuil, fecha).subscribe((res) => {
       const nombre = res.m_Item1;
       const gastos = res.m_Item2;

       Swal.fire({
          icon: "info",
          title: `${nombre}`,
          text: `Total a pagar a fin de mes: $${gastos}`
       });

    });
 }

 verComprasUsuario(cuil: number, fecha: string): void {
  this.router.navigate(['/admin/compras/usuario', cuil, 'fecha', fecha]);
}

  obtenerGastos(desde: string, hasta: string): void {
    console.log(desde, hasta)
    this.compraService.getGastos(desde, hasta).subscribe((res) => {
      this.gastos = res;
    });
  }


  onSetData(select: any): void {
    this.compra.cuil = select.cuil;
  }
}
