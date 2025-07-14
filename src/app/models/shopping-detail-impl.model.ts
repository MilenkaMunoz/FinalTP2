// shopping-detail-impl.model.ts
export class ShoppingDetailImpl {
  shopping: any;  // El objeto completo de la compra
  status: string;
  quantity: number;
  unitPrice: number;

  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  constructor(shopping: any, status: string, quantity: number, unitPrice: number) {
    this.shopping = shopping;
    this.status = status;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }
}
