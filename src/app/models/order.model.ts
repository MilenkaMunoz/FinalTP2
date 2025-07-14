import { Client } from './client.model';
import { OrderDetail } from './order-detail.model';

export interface Order {
    id?: number;
    client: Client;
    deliveryAddress: string;
    orderDate: string;
    deliveryDate: string;
    totalAmount: number;
    status: string;
    active: string;
    orderDetails: OrderDetail[];
}