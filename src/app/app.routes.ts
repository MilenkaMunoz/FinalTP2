import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerListComponent } from './customers/components/customer-list/customer-list.component';
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { SaleListComponent } from './sales/components/sale-list/sale-list.component';
import { CustomerFormComponent } from './customers/components/customer-form/customer-form.component';
import { ProductFormComponent } from './products/components/product-form/product-form.component';
import { SaleFormComponent } from './sales/components/sale-form/sale-form.component';
import { SaleDetailComponent } from './sales/components/sale-detail/sale-detail.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/form', component: CustomerFormComponent },
      { path: 'customers/form/:id', component: CustomerFormComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/form', component: ProductFormComponent },
      { path: 'products/form/:id', component: ProductFormComponent },
      { path: 'sales', component: SaleListComponent },
      { path: 'sales/form', component: SaleFormComponent },
      { path: 'sales/form/:id', component: SaleFormComponent },
      { path: 'sales/detail/:id', component: SaleDetailComponent },
      { path: '', redirectTo: 'customers', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
