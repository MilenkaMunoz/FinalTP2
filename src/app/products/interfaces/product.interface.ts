export interface Product {
  productId?: number;
  productCode: string;
  productName: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  category: string;
  status: string;
}
