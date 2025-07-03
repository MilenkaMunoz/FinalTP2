import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// Customers
import { CustomerListComponent } from './customers/components/customer-list/customer-list.component';
import { CustomerFormComponent } from './customers/components/customer-form/customer-form.component';

// Products
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { ProductFormComponent } from './products/components/product-form/product-form.component';

// Sales
import { SaleListComponent } from './sales/components/sale-list/sale-list.component';
import { SaleFormComponent } from './sales/components/sale-form/sale-form.component';

@NgModule({
  declarations: [
    AppComponent,
    // Customer components
    CustomerListComponent,
    CustomerFormComponent,
    // Product components
    ProductListComponent,
    ProductFormComponent,
    // Sale components
    SaleListComponent,
    SaleFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
