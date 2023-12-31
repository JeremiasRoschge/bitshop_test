import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent {
  onImprimir () {
    const data = localStorage.getItem('compra')

    console.log(data)
  }
}
