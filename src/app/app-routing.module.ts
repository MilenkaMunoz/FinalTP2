import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customers/components/customer-list/customer-list.component';
import { CustomerFormComponent } from './customers/components/customer-form/customer-form.component';
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { ProductFormComponent } from './products/components/product-form/product-form.component';
import { SaleListComponent } from './sales/components/sale-list/sale-list.component';
import { SaleFormComponent } from './sales/components/sale-form/sale-form.component';


const routes: Routes = [
  { path: '', component: CustomerListComponent },
  { path: 'form', component: CustomerFormComponent },
  { path: 'form/:id', component: CustomerFormComponent },
  { path: '**', redirectTo: '' },
    { path: 'products', component: ProductListComponent },
  { path: 'products/form', component: ProductFormComponent },
  { path: 'products/form/:id', component: ProductFormComponent },
    { path: 'sales', component: SaleListComponent },
  { path: 'sales/form', component: SaleFormComponent },
  { path: 'sales/form/:id', component: SaleFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
