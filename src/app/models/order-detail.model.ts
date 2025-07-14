import { Product } from './product.model';

export interface OrderDetail {
    id?: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    status: string;
}