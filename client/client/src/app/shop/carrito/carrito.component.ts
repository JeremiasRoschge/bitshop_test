import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreCompra } from './models/compra';
import { ProductCarrito } from "../../admin/products/models/product";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
getRange(arg0: any): any {
throw new Error('Method not implemented.');
}
  constructor(private router: Router) {}

  listaDeCompras: PreCompra[] = [];
  listaDeProductos: ProductCarrito[] = [];
  selectedQuantity: number | undefined;
  precompras: PreCompra[] = [];
  selectedProduct: any | undefined;
  private cantidadProductoSource = new BehaviorSubject<number>(0);
  cantidadProducto$ = this.cantidadProductoSource.asObservable();

  ngOnInit(): void {
    this.onCarrito();
    console.log(this.listaDeProductos)
    this.selectedProduct = this.listaDeCompras.length > 0 ? this.listaDeCompras[0] : undefined;
    this.selectedQuantity = this.selectedProduct?.cantidad;
    
  }

  opcionSeleccionada: string = '';

  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }
  

  realizarPago(): void {
    switch (this.opcionSeleccionada) {
      case 'mercadopago':
        this.router.navigate(['shop/pay/mercadopago'] as any);
        break;
      case 'paycloud':
        this.router.navigate(['shop/pay/paycloud'] as any);
        break;
      case 'PagarFinDeMes':
        this.router.navigate(['shop/pay/findemes'])
    }
  }

  setCantidadProducto(cantidad: number): void {
    this.cantidadProductoSource.next(cantidad);
  }

  calcularPrecioTotal(): number {
    return this.listaDeCompras.reduce((total: number, compra: any) => {
      const producto = this.listaDeProductos.find((p: any) => p.id === compra.id_prod);
      const precioProducto = producto ? producto.precio : 0;
      return total + compra.cantidad * precioProducto;
    }, 0);
  }
  
  updateCantidad(cantidad: number, idProducto: number): void {
    const compra = this.listaDeCompras.find(c => c.id_prod === idProducto);
    if (compra) {
      compra.cantidad = cantidad;
    }
  }


  eliminarProducto(idProducto: number): void {
    // Obtén la lista actual de productos del sessionStorage
    const productosString = sessionStorage.getItem('productos');
    let productos: ProductCarrito[] = [];  // Usa el tipo Product
    if (productosString) {
      productos = JSON.parse(productosString);

      productos = productos.filter((producto) => producto.id !== idProducto);

      sessionStorage.setItem('productos', JSON.stringify(productos));

      console.log('Producto eliminado. Nueva lista de productos:', productos);

      this.listaDeProductos = productos;
    }

    const comprasString = sessionStorage.getItem('precompras');
    let compras: PreCompra[] = [];  // Usa el tipo PreCompra
    if (comprasString) {
      compras = JSON.parse(comprasString);

      compras = compras.filter((compra) => compra.id_prod !== idProducto);

      sessionStorage.setItem('precompras', JSON.stringify(compras));

      console.log('Compra eliminada. Nueva lista de compras:', compras);

      this.listaDeCompras = compras;
    }
  }
  getRangeForProduct(productId: number): number[] {
    // Obtén el producto correspondiente de listaDeProductos
    const producto = this.listaDeProductos.find((p: ProductCarrito) => p.id === productId);
  
    // Verifica si el producto existe y tiene un stock definido
    if (producto && producto.stock) {
      // Genera las cantidades basadas en el stock del producto
      return Array.from({ length: producto.stock }, (_, index) => index + 1);
    } else {
      // Si no hay producto o no hay stock definido, retorna un array vacío
      return [];
    }
  }
  get totalCantidad(): number {
    return this.listaDeProductos.reduce((total, producto) => total + producto.cantidad, 0);
  }

  onCarrito(): void {
    const carrito = sessionStorage.getItem('precompras');
  
    if (carrito) {
      this.listaDeCompras = JSON.parse(carrito);
      this.listaDeCompras.forEach((compra: PreCompra) => {  // Usa el tipo PreCompra
        compra.cantidad = compra.cantidad || 1;
      });
  
      console.log('Lista de Compras:', this.listaDeCompras);
    }

    console.log('Lista de Compras:', this.listaDeCompras);
    const productos = sessionStorage.getItem('productos');

    if (productos) {
      const listaDeProductos: ProductCarrito[] = JSON.parse(productos);
      this.listaDeProductos = listaDeProductos;
    
      // Supongamos que productId es el identificador único del producto que deseas obtener
      const productId = 14; // Deberías establecer esto dinámicamente según tu lógica
    
      // Buscar el producto en this.listaDeProductos con el id específico
      const producto = this.listaDeProductos.find((p: ProductCarrito) => p.id === productId);
    
      // Verificar si el producto existe y tiene la propiedad 'stock'
      if (producto && producto.stock) {
        // Acceder a la propiedad 'stock'
        const stock = producto.stock;
        console.log('Stock del producto:', stock);
      } else {
        console.log('No se encontró el producto o no tiene propiedad de stock.');
      }
    } else {
      console.log('El carrito está vacío.');
    }
    
  }}
  