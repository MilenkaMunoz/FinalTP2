import { Client } from './client.model';
import { ShoppingDetail } from './shopping-detail.model';
import { ShoppingDetailDTO } from './shopping-detail.dto.model';// Asegúrate de tener la estructura de Client también
import { Product } from './product.model';

//shopping-dto.model

export class ShoppingDTO {
  id: number;
  client: Client;
  shoppingDate: Date;
  total: number;
  status: string;
  shoppingDetails: ShoppingDetailDTO[]; // Esta es la lista de detalles
  showDetails: boolean = false; // Para manejar la visibilidad de los detalles

  // Propiedades de producto si se desean en el ShoppingDTO
  product: Product | null = null; // Puedes definir un objeto de producto si lo necesitas
  quantity: number = 0;
  unitPrice: number = 0;

  constructor(
    id: number,
    client: Client,
    shoppingDate: Date,
    total: number,
    status: string,
    shoppingDetails: ShoppingDetailDTO[],
    product: Product | null = null,
    quantity: number = 0,
    unitPrice: number = 0
  ) {
    this.id = id;
    this.client = client;
    this.shoppingDate = shoppingDate;
    this.total = total;
    this.status = status;
    this.shoppingDetails = shoppingDetails;
    this.product = product;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  // Método estático para calcular el total de una compra (sin instanciar la clase)
  static calculateTotal(shoppingDetails: ShoppingDetailDTO[]): number {
    return shoppingDetails.reduce((acc, detail) => acc + detail.getTotal(), 0);
  }
}

