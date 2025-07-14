import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderRequest } from '../models/order-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/app/orders';  // Ajusta según tu URL

  constructor(private http: HttpClient) { }

  // Obtener todos los pedidos
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  // Obtener pedidos activos
  getActiveOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/active`);
  }

  // Obtener pedidos inactivos
  getInactiveOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/inactive`);
  }

  // Obtener un pedido por ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo pedido
  createOrder(orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderRequest);
  }

  // Actualizar un pedido
  updateOrder(id: number, orderRequest: OrderRequest): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, orderRequest);
  }

  // Desactivar un pedido
  deactivateOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Activar un pedido
  activateOrder(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/activate`, {});
  }
}