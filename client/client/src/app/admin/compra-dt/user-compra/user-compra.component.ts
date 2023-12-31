import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from "./user.service";
import { CompraDtService } from '../services/compra-dt.service'
import { Compra } from "../services/models/compra";

@Component({
  selector: 'app-user-compra',
  templateUrl: './user-compra.component.html',
  styleUrls: ['./user-compra.component.css']
})
export class UserCompraComponent implements OnInit{
  datatable: any = [];
  gastos: any;
  nombre_completo: string = '';
  compra: Compra = new Compra();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private compraService: CompraDtService
  ) { }

  ngOnInit(): void {
    this.buscarGastos()
    this.onDataTable();
  }

    onDataTable(): void {

      this.route.params.subscribe(params => {
        const cuil = +params['cuil'];
        const fecha = params['fecha'];
  
        // Dividir la fecha en año y mes
        const [year, month] = fecha.split('-').map(Number);

        this.userService.getComprasPorUsuarioYFecha(cuil, year, month)
          .subscribe(res => {
            this.datatable = res;
          });
      });
  }

  buscarGastos(): void {
    this.route.params.subscribe(params => {
      const cuil = +params['cuil']
      const fecha = params['fecha']
      this.compraService.getGastosEmpleado(cuil, fecha).subscribe((res) => {
        const nombre = res.m_Item1;
        const gastos = res.m_Item2;
        this.gastos = gastos
    })
 })
  }

  onSetData(select: Compra): void {
    this.compra.cuil = select.cuil;
    
  }
}
