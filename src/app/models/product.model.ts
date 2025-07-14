import { Category } from './category.model';

export interface Product {
  id: number;                   // Identificador único del producto
  productCode: string;          // Código del producto
  productName: string;          // Nombre del producto
  description?: string;         // Descripción del producto (opcional)
  purchasePrice: number;        // Precio de compra
  price: number;                // Precio de venta
  stock: number;                // Cantidad en inventario
  category: Category;           // Relación con la categoría del producto
  manufactureDate?: Date;       // Fecha de fabricación (opcional)
  expirationDate?: Date;        // Fecha de caducidad (opcional)
  status: string;               // Estado del producto (Activo/Inactivo)
}
