import { Component } from '@angular/core';
import { Product } from 'src/app/admin/products/models/product';
import { ProductService } from '../../admin/products/services/products.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PreCompra } from './models/compra';
import { SharedDataService } from '../carrito/services/carrito.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent {
Array(arg0: number) {
throw new Error('Method not implemented.');
}
  constructor(private productService: ProductService, private router: Router, private sharedDataService: SharedDataService) {}
  precompra: PreCompra[] = [];
  datatable: any = [];
  searchTerm: string = '';
  isMenuOpen = false;
  itemsPerPage: number = 15;
  currentPage: number = 1;

  get totalItems(): number {
    return this.datatable.length;
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.datatable.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }


  decrementCantidad(producto: any): void {
    if (producto.cantidad > 0) {
      console.log('Antes de decrementar, cantidad:', producto.cantidad);
      producto.cantidad--;
      console.log('Después de decrementar, cantidad:', producto.cantidad);
    }
  }

  incrementCantidad(producto: any): void {
    
      console.log('Antes de incremntar, cantidad:', producto.cantidad);
      producto.cantidad++;
      console.log('Después de incrementar, cantidad:', producto.cantidad);
    
  }
  
  onBuying(producto: any, cantidad: number, event: Event): void {
    event.preventDefault();
    console.log('Cantidad que se pasa a onBuying:', cantidad);

    const cantidadSeleccionada = producto.cantidad;
  
    if (cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: '¡Cantidad inválida!',
        text: 'Por favor, selecciona una cantidad mayor que 0 para realizar la compra.',
      });
      return;
    }
  
    const userDataString = sessionStorage.getItem('user');
  
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const cuilUsuario = userData.cuil;
  
      // Recuperar la lista de compras existente del sessionStorage
      const precomprasString = sessionStorage.getItem('precompras');
      let precompras: PreCompra[] = [];
  
      if (precomprasString) {
        precompras = JSON.parse(precomprasString);
      }
  
      // Verificar si la compra ya existe en la lista
      const compraExistenteIndex = precompras.findIndex((c) => c.id_prod === producto.id);
  
      if (compraExistenteIndex !== -1) {
        // Actualizar la cantidad si ya existe
        precompras[compraExistenteIndex].cantidad += cantidad;
      } else {
        // Agregar la nueva compra a la lista de compras
        const nuevaCompra: PreCompra = {
          cuil: cuilUsuario ? parseInt(cuilUsuario) : 0,
          id_prod: producto.id,
          cantidad: cantidadSeleccionada,
          gastos: producto.precio * cantidadSeleccionada,
          fecha: new Date(),
        };
  
        precompras.push(nuevaCompra);
      }
  
      // Almacenar la lista actualizada de compras en el sessionStorage
      sessionStorage.setItem('precompras', JSON.stringify(precompras));
  
      // Recuperar la lista de productos existente del sessionStorage
      const productosString = sessionStorage.getItem('productos');
      let productos: any[] = [];
  
      if (productosString) {
        productos = JSON.parse(productosString);
      }
  
      // Verificar si el producto ya existe en la lista
      const productoExistenteIndex = productos.findIndex((p) => p.id === producto.id);

      if (productoExistenteIndex !== -1) {
        // Actualizar la cantidad si ya existe
        productos[productoExistenteIndex].cantidad += cantidad;
      } else {
        // Agregar el nuevo producto a la lista de productos
        productos.push({
          ...producto,
          cantidad: cantidadSeleccionada, // Establecer la cantidad proporcionada
        });
      }
  
      // Almacenar la lista actualizada de productos en el sessionStorage
      sessionStorage.setItem('productos', JSON.stringify(productos));
  
      // Redirigir a la página del carrito
      this.router.navigate(['shop/carrito']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error. Inténtalo de nuevo o comunícate con soporte técnico.',
      });
    }
  }
  
  


  onAddCarrito(producto: any, cantidad: number, event: Event): void {
    event.preventDefault();
    const cantidadSeleccionada = producto.cantidad;
  
    if (producto.cantidad === 0) {
      Swal.fire({
        icon: 'warning',
        title: '¡Cantidad inválida!',
        text: 'Por favor, selecciona una cantidad mayor que 0 para realizar la compra.',
      });
      return;
    }
  
    const userDataString = sessionStorage.getItem('user');
  
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const cuilUsuario = userData.cuil;
  
      // Recuperar la lista de productos existente del sessionStorage
      const productosString = sessionStorage.getItem('productos');
      let productos: any[] = [];
      if (productosString) {
        productos = JSON.parse(productosString);
      }
  
      // Verificar si el producto ya existe en la lista
      const productoExistente = productos.find((p) => p.id === producto.id);
  
      if (!productoExistente) {
        // Agregar el nuevo producto a la lista de productos
        productos.push({
          ...producto,
          cantidad: cantidadSeleccionada, // Establecer la cantidad proporcionada
        });
  
        // Almacenar la lista actualizada de productos en el sessionStorage
        sessionStorage.setItem('productos', JSON.stringify(productos));
      }
  
      const compraExistente = this.precompra.find((c: PreCompra) => c.id_prod === producto.id);
      const gastos = producto.precio * producto.cantidad;
  
      if (compraExistente) {
        compraExistente.cantidad += cantidad;
        Swal.fire({
          text: "El producto se agrego al carrito!",
          icon: "success"
        });
      } else {
        // Agregar el nuevo producto a precompra
        this.precompra.push({
          cuil: cuilUsuario ? parseInt(cuilUsuario) : 0,
          id_prod: producto.id,
          cantidad: cantidadSeleccionada,
          gastos: gastos,
          fecha: new Date(),
        });

        Swal.fire({
          text: "El producto se agrego al carrito!",
          icon: "success"
        });
      }
  
      sessionStorage.setItem('precompras', JSON.stringify(this.precompra));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error. Inténtalo de nuevo o comunícate con soporte técnico.',
      });
    }
  }

  onDataTable(): void {
    this.productService.getProduct().subscribe((res) => {
      // Filtrar productos con stock mayor a 0
      this.datatable = res
        .filter((product: any) => product.stock > 0)
        .map((product: any) => ({ ...product, cantidad: 0 }));
  
      console.log(this.datatable);
    });
  }
  

  filterProducts(): void {
    if (this.searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, restaurar la lista completa de productos
      this.onDataTable();
    } else {
      // Filtrar productos según el término de búsqueda
      this.datatable = this.datatable.filter((product: any) =>
        product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }



  ngOnInit(): void {
    this.onDataTable();
  }
}
