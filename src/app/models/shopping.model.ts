import { Client } from './client.model';
import { ShoppingDetail } from './shopping-detail.model';
import { Product } from './product.model';

// shopping.model.ts
export interface Shopping {
  id: number;
  client: Client;
  product: Product; // Relación con producto
  quantity: number; // Cantidad de productos
  unitPrice: number; // Precio unitario
  shoppingDate: Date;
  total: number;
  status: string;
  showDetails?: boolean;
  shoppingDetails?: ShoppingDetail[]; // Relación con los detalles de la compra
}

