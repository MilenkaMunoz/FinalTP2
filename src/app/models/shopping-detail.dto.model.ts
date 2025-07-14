// shopping.model.ts
import { Product } from './product.model';
import { Shopping } from './shopping.model';

export class ShoppingDetailDTO {
  id: number;              // Identificador único del detalle
  shoppingId: number;      // Identificador de la compra
  product: Product;        // Relación con el producto
  quantity: number;        // Cantidad del producto
  unitPrice: number;       // Precio unitario del producto
  status: string;          // Estado del detalle (Activo/Inactivo)

  constructor(
    id: number,
    shoppingId: number,
    product: Product,
    quantity: number,
    unitPrice: number,
    status: string // Aseguramos que el estado se pase también al DTO
  ) {
    this.id = id;
    this.shoppingId = shoppingId;
    this.product = product;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.status = status;  // Asignación del estado
  }

  // Método para obtener el total (cantidad * precio unitario)
  getTotal(): number {
    return this.quantity * this.unitPrice;
  }

  // Método para obtener el subtotal (también podría ser calculado en el Impl si es necesario)
  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }
}

// Implementación de ShoppingDetailDTO para transformar en ShoppingDetailImpl
export class ShoppingDetailImpl {
  shopping: Shopping;     // Objeto completo de la compra
  status: string;         // Estado del detalle
  quantity: number;       // Cantidad del producto
  unitPrice: number;      // Precio unitario del producto
  product: Product;       // Producto relacionado con el detalle

  constructor(
    shopping: Shopping,
    status: string,
    quantity: number,
    unitPrice: number,
    product: Product
  ) {
    this.shopping = shopping;
    this.status = status;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.product = product;  // Asignación del producto
  }

  // Getter para calcular el subtotal automáticamente
  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
