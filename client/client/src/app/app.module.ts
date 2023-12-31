import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './admin/employees/employee.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './admin/products/products.component';
import { AuthComponent } from './auth/auth.component';
import { ShopComponent } from './shop/listShop/shop.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyComponent } from './body/body.component';
import { ShopCartComponent } from './shop/shop-cart/shop-cart.component';
import { PayComponent } from './shop/pay/mercadopago/pay.component';
import { MercadoPagoService } from "./shop/pay/mercadopago/service/mercadopago.service";
import { CarritoComponent } from './shop/carrito/carrito.component';
import { FinDeMesComponent } from './shop/pay/fin-de-mes/fin-de-mes.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PaycloudComponent } from './shop/pay/paycloud/paycloud.component';
import { CompraDtComponent } from './admin/compra-dt/compra-dt.component';
import { UserCompraComponent } from './admin/compra-dt/user-compra/user-compra.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    ProductComponent,
    AuthComponent,
    ShopComponent,
    SidenavComponent,
    BodyComponent,
    ShopCartComponent,
    PayComponent,
    CarritoComponent,
    FinDeMesComponent,
    PaycloudComponent,
    CompraDtComponent,
    UserCompraComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    QRCodeModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp({
      "projectId": "bitshop-fd7b3",
      "appId": "1:935323697193:web:33d54d68ef1c017c2b1c38",
      "storageBucket": "bitshop-fd7b3.appspot.com",
      "apiKey": "AIzaSyDKYqmveAt4FLEL7J_Gpxi0yMYMtI2HnYU",
      "authDomain": "bitshop-fd7b3.firebaseapp.com",
      "messagingSenderId": "935323697193",
      "measurementId": "G-CTKLLSCW4D"
    }),
    AngularFireStorageModule
  ],
  providers: [MercadoPagoService],
  bootstrap: [AppComponent, EmployeeComponent, ProductComponent, CarritoComponent]
})
export class AppModule { }
