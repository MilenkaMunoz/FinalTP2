import { Product } from './product.model';
import { Shopping } from './shopping.model';

export interface ShoppingDetail {
  id: number;              // Identificador único del detalle
  shopping: Shopping;      // Relación con la compra
  product: Product;        // Relación con el producto
  quantity: number;        // Cantidad del producto
  unitPrice: number;       // Precio unitario del producto
  status: string;          // Estado del detalle (Activo/Inactivo)
  getSubtotal(): number;   // Método para obtener el subtotal
}

// Implementación de ShoppingDetail con un getter para el subtotal
export class ShoppingDetailImpl implements ShoppingDetail {
  id: number;
  shopping: Shopping;
  product: Product;
  quantity: number;
  unitPrice: number;
  status: string;

  constructor(
    id: number,
    shopping: Shopping,
    product: Product,
    quantity: number,
    unitPrice: number,
    status: string
  ) {
    this.id = id;
    this.shopping = shopping;
    this.product = product;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.status = status;
  }

  // Getter para calcular el subtotal automáticamente
  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
