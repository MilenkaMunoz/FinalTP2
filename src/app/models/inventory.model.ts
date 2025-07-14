import { Product } from './product.model';

export interface Inventory {
  id: number;
  product: Product;
  movementQuantity: number;
  movementType: string;
  movementDate: Date; // Cambiado a Date
  status: string;
}

