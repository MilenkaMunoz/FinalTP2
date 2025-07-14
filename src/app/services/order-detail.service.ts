import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetail } from '../models/order-detail.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private apiUrl = 'http://localhost:8080/app/order-details'; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Obtener todos los detalles activos
  getAllActiveOrderDetails(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/active`);
  }

  // Obtener todos los detalles inactivos
  getAllInactiveOrderDetails(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/inactive`);
  }

  // Obtener un detalle por ID
  getOrderDetailById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${id}`);
  }

  // Obtener detalles por ID de orden
  getOrderDetailsByOrderId(orderId: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/order/${orderId}`);
  }

  // Crear un nuevo detalle
  createOrderDetail(orderDetail: OrderDetail): Observable<OrderDetail> {
    return this.http.post<OrderDetail>(this.apiUrl, orderDetail);
  }

  // Crear múltiples detalles
  createOrderDetails(orderDetails: OrderDetail[]): Observable<OrderDetail[]> {
    return this.http.post<OrderDetail[]>(`${this.apiUrl}/batch`, orderDetails);
  }

  // Actualizar un detalle
  updateOrderDetail(id: number, orderDetail: OrderDetail): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.apiUrl}/${id}`, orderDetail);
  }

  // Eliminar un detalle
  deleteOrderDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Desactivar un detalle
  deactivateOrderDetail(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Activar un detalle
  activateOrderDetail(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/activate`, {});
  }
}
