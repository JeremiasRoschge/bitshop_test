export class Product {
  id:number = 0;
  nombre:string = "";
  precio:number = 0;
  stock:number = 0;
  imagenUrl: string = '';
  selectedId:number = 0;
}

export class ProductUpdate {
  id?: number = 0;
  nombre: string = "";
  precio: number = 0;
  stock: number = 0;
  imagenUrl: string = '';
  selectedId:number = 0;
}


export class ProductCarrito {
  id:number = 0;
  nombre:string = "";
  precio:number = 0;
  stock:number = 0;
  imagenUrl: string = '';
  selectedId:number = 0;
  cantidad: number = 0;
}

