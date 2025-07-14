import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientFormComponent } from './components/clients/client-form/client-form.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryFormComponent } from './components/inventory/inventory-form/inventory-form.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { ShoppingFormComponent } from './components/shopping/shopping-form/shopping-form.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryFormComponent } from './components/category/category-form/category-form.component';
// Agregar estas dos importaciones
import { OrderComponent } from './components/order/order.component';
import { OrderFormComponent } from './components/order/order-form/order-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductsComponent },
  { path: 'productos/crear', component: ProductFormComponent },
  { path: 'productos/editar/:id', component: ProductFormComponent },
  { path: 'clientes', component: ClientsComponent },
  { path: 'clientes/crear', component: ClientFormComponent },
  { path: 'clientes/editar/:id', component: ClientFormComponent },
  { path: 'inventarios', component: InventoryComponent },
  { path: 'inventarios/crear', component: InventoryFormComponent },
  { path: 'inventarios/editar/:id', component: InventoryFormComponent },
  { path: 'compras', component: ShoppingComponent },
  { path: 'compras/crear', component: ShoppingFormComponent },
  { path: 'compras/editar/:id', component: ShoppingFormComponent },
  { path: 'ordenes', component: OrderComponent },
  { path: 'ordenes/crear', component: OrderFormComponent },
  { path: 'ordenes/editar/:id', component: OrderFormComponent },
  { path: 'categorias', component: CategoryComponent },
  { path: 'categorias/crear', component: CategoryFormComponent },
  { path: 'categorias/editar/:id', component: CategoryFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }