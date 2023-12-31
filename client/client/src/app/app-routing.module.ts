import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './admin/employees/employee.component'
import { ProductComponent } from "./admin/products/products.component";
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ShopComponent } from './shop/listShop/shop.component';
import { AuthGuard } from './auth-guard/auth-guard';
import { PayComponent } from './shop/pay/mercadopago/pay.component';
import { CarritoComponent } from './shop/carrito/carrito.component';
import { PaycloudComponent } from './shop/pay/paycloud/paycloud.component';
import { CompraDtComponent } from './admin/compra-dt/compra-dt.component';
import { FinDeMesComponent } from './shop/pay/fin-de-mes/fin-de-mes.component';
import { AdminGuard } from './auth-guard/admin-guard';
import { UserCompraComponent } from './admin/compra-dt/user-compra/user-compra.component';

const routes: Routes = [
  { path: '', component: AuthComponent},
  { path: 'shop', component: ShopComponent, canActivate: [AuthGuard]},
  { path:'shop/carrito', component: CarritoComponent, canActivate: [AuthGuard]},
  { path:'shop/pay/mercadopago', component: PayComponent, canActivate: [AuthGuard]},
  { path:'shop/pay/paycloud', component: PaycloudComponent, canActivate: [AuthGuard]},
  { path:'shop/pay/findemes', component: FinDeMesComponent, canActivate: [AuthGuard]},
  { path: 'admin/products', component: ProductComponent, canActivate: [AdminGuard]},
  { path: 'admin/compras', component: CompraDtComponent},
  { path: 'admin/compras/usuario/:cuil/fecha/:fecha', component: UserCompraComponent },
  { path: 'admin/employee', component: EmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
