export class Carrito {
  items: any[] = [];

  agregarProducto(producto: any, cantidad: number): void {
    const itemEnCarrito = this.items.find(item => item.id === producto.id);

    if (itemEnCarrito) {
      itemEnCarrito.cantidad += cantidad;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad
      });
    }
  }

  obtenerCarrito(): any[] {
    return this.items;
  }

  limpiarCarrito(): void {
    this.items = [];
  }
}