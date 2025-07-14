import { OrderDetailRequest } from '../models/order-detail-request.model';

export interface OrderRequest {
    client: number;  // ID del cliente
    deliveryAddress: string;
    orderDate: string;
    deliveryDate: string;
    status: string;
    active: string;
    details: OrderDetailRequest[];
}