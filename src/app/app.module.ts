import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientFormComponent } from './components/clients/client-form/client-form.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryFormComponent } from './components/inventory/inventory-form/inventory-form.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { ShoppingFormComponent } from './components/shopping/shopping-form/shopping-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CategoryComponent } from './components/category/category.component';
import { CategoryFormComponent } from './components/category/category-form/category-form.component';
import { OrderComponent } from './components/order/order.component';
import { OrderFormComponent } from './components/order/order-form/order-form.component'; // Importar ToastrModule
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    ProductsComponent,
    ProductFormComponent,
    ClientsComponent,
    ClientFormComponent,
    InventoryComponent,
    InventoryFormComponent,
    ShoppingComponent,
    ShoppingFormComponent,
    CategoryComponent,
    CategoryFormComponent,
    OrderComponent,
    OrderFormComponent,  // Declarar el formulario de cliente
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule, // Importar FormsModule para ngModel
    HttpClientModule, BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),  // Importar HttpClientModule para solicitudes HTTP
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
