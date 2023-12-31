// shop-cart.component.ts
import { Component, OnInit, Input} from '@angular/core';
import { CarritoService } from './service/carrito.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css']
})
export class ShopCartComponent implements OnInit {
  @Input() isMenuOpen: boolean = false;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.isMenuOpen$.subscribe((isMenuOpen) => {
      this.isMenuOpen = isMenuOpen;
    });
  }

  closeMenu() {
    this.carritoService.toggleMenu();
  }
}
