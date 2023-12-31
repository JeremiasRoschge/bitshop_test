import { Component, OnInit } from '@angular/core';
import { Product, ProductUpdate} from './models/product';
import Swal from 'sweetalert2'
import { ProductService } from './services/products.service';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  product: Product = new Product();
  datatable: any = [];
  uploadTask: AngularFireUploadTask | null = null; 

  constructor(private productService: ProductService) {}

  //VALIDACIONES PARA EL MODEL PRODUCTO

  validateProductName(nombre: string): boolean {
    if (!nombre) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre del producto no puede estar vacío!"
      });
      return false;
    }
    return true;
  }

  validateStock(stock: any): boolean {
    if (stock <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar el stock!"
      });
      return false;
    }
    return true;
  }

  validatePrecio(precio: any): boolean {
    if (precio <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar el precio!"
      });
      return false;
    }
    return true;
  }
  validateProduct(product: Product): boolean {
    return (
      this.validateProductName(product.nombre) &&
      this.validateStock(product.stock) &&
      this.validatePrecio(product.precio)
    );
  }

  ngOnInit(): void {
    this.onDataTable();
  }
  


  onDataTable(): void {
    this.productService.getProduct().subscribe((res) => {
      this.datatable = res;
      console.log(res);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
  
    // Verificar si se selecciona un archivo
    if (file) {
      // Iniciar la tarea de carga de imágenes
      this.uploadTask = this.productService.uploadImage(file);
  
      // Suscribirse para obtener actualizaciones de progreso
      this.uploadTask.percentageChanges().subscribe(
        (percentage: number | undefined) => {
          if (percentage !== undefined) {
            console.log(`Carga completada en ${percentage}%`);
          }
        },
        (error) => {
          console.error('Error durante la carga de la imagen:', error);
        }
      );
  
      // Recibir notificación cuando se complete la carga
      this.uploadTask.then(snapshot => {
        console.log('¡Carga completada!');
        snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log('URL de descarga:', downloadURL);
          this.product.imagenUrl = downloadURL;
      
          // Restablecer this.uploadTask a null después de completar la carga
          this.uploadTask = null;
        });
      });
      
    }
  }

  onAddProduct(product: Product): void {
    if (this.validateProduct(product)) {
      // Verificar si hay una tarea de carga en curso
      if (this.uploadTask) {
        Swal.fire({
          icon: 'info',
          title: 'Por favor espera',
          text: 'La carga de la imagen está en progreso. Por favor, espera a que se complete.'
        });
      } else {
        console.log("Component",product)
        this.productService.addProduct(product).subscribe((res) => {
          if (res) {
            Swal.fire({
              title: 'Nuevo producto agregado',
              text: `El producto ${product.nombre} se ha registrado con éxito`,
              icon: 'success'
            });
            this.clear();
            this.onDataTable();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error. Inténtalo de nuevo o comunícate con soporte técnico.'
            });
          }
        });
      }
    }
  }


  onUpdateProduct(product: Product): void {
   if(this.validateProduct(product)) {
    const { id, ...productUpdateWithoutId } = product;
  
    // Verificar si la propiedad id está definida antes de realizar la llamada
    if (id !== undefined) {
      // Verificar si se seleccionó un archivo para cargar
      if (this.uploadTask) {
        // Mostrar un mensaje mientras se carga la imagen
        Swal.fire({
          icon: 'info',
          title: 'Por favor espera',
          text: 'La carga de la imagen está en progreso. Por favor, espera a que se complete.'
        });
        
        // Esperar a que se complete la carga de la imagen
        this.uploadTask.then(snapshot => {
          // Obtener la URL de descarga y establecerla en el objeto de tu producto
          snapshot.ref.getDownloadURL().then(downloadURL => {
            productUpdateWithoutId.imagenUrl = downloadURL;
  
            // Realizar la actualización del producto con la nueva URL de la imagen
            this.confirmedUpdate(id, productUpdateWithoutId);
          });
        });
      } else {
        // Si no hay tarea de carga de imagen en curso, realizar la actualización del producto directamente
        const productToUpdate: ProductUpdate = {
          id: id,
          nombre: productUpdateWithoutId.nombre,
          precio: productUpdateWithoutId.precio,
          stock: productUpdateWithoutId.stock,
          imagenUrl: productUpdateWithoutId.imagenUrl,
          selectedId: productUpdateWithoutId.selectedId
        };
  
        Swal.fire({
          title: "¿Estás seguro de modificar este producto?",
          text: "No podrás revertir esto.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, modificarlo"
        }).then((result) => {
          if (result.isConfirmed) {
            // Usuario confirmó la modificación
            this.confirmedUpdate(id, productToUpdate);
          }
        });
      }
    }
   }
  }
  private confirmedUpdate(id: number, productToUpdate: ProductUpdate): void {
    this.productService.updateProduct(id, productToUpdate).subscribe(
      () => {
        // Modificación exitosa
        Swal.fire({
          title: "Producto modificado",
          text: `El producto ${productToUpdate.nombre} se ha modificado con éxito.`,
          icon: "success"
        });
        this.clear();
        this.onDataTable();
      },
      () => {
        // Manejo de errores
        Swal.fire({
          title: "Error!",
          text: "Algo salió mal.",
          icon: "error"
        });
      }
    );
  }
  

  onDeleteProduct(id: number, nombre: string): void {
    Swal.fire({
      title: "¿Estás seguro de eliminar este producto?",
      text: `¿Quieres eliminar el producto: ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, elimínalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Usuario confirmó la eliminación
        this.confirmedDeleteProduct(id, nombre);
      }
    });
  }
  
  private confirmedDeleteProduct(id: number, nombre: string): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        // Eliminación exitosa
        Swal.fire({
          title: "Producto eliminado",
          text: `El producto: ${nombre} ha sido eliminado exitosamente`,
          icon: "success"
        });
        this.clear();
        this.onDataTable();
      },
      () => {
        // Manejo de errores
        Swal.fire({
          title: "Error!",
          text: "Algo salió mal.",
          icon: "error"
        });
      }
    );
  }
  

  onSetData(select: any): void {
    this.product.id = select.id;
    this.product.nombre = select.nombre;
    this.product.precio = select.precio;
    this.product.stock = select.stock;
    this.product.imagenUrl = select.imagenUrl
  }

  clear(): void {
    this.product.id = 0;
    this.product.nombre = '';
    this.product.precio = 0;
    this.product.stock = 0;
    this.product.imagenUrl = '';
    
  }
}