import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingDetail } from '../models/shopping-detail.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingDetailService {

  private apiUrl = 'http://localhost:8080/app/shopping-details'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) { }

  // Obtener todos los detalles de compras activos
  getAllActiveShoppingDetails(): Observable<ShoppingDetail[]> {
    return this.http.get<ShoppingDetail[]>(`${this.apiUrl}/active`);
  }

  // Obtener todos los detalles de compras inactivos
  getAllInactiveShoppingDetails(): Observable<ShoppingDetail[]> {
    return this.http.get<ShoppingDetail[]>(`${this.apiUrl}/inactive`);
  }

  // Obtener detalle de compra por ID
  getShoppingDetailById(id: number): Observable<ShoppingDetail> {
    return this.http.get<ShoppingDetail>(`${this.apiUrl}/${id}`);
  }

  getDetailsByShoppingId(shoppingId: number): Observable<ShoppingDetail[]> {
    return this.http.get<ShoppingDetail[]>(`${this.apiUrl}/shopping/${shoppingId}`);
  }

  // Crear un nuevo detalle de compra
  createShoppingDetail(shoppingDetail: ShoppingDetail): Observable<ShoppingDetail> {
    return this.http.post<ShoppingDetail>(this.apiUrl, shoppingDetail);
  }

  // Actualizar un detalle de compra existente
  updateShoppingDetail(id: number, shoppingDetail: ShoppingDetail): Observable<ShoppingDetail> {
    return this.http.put<ShoppingDetail>(`${this.apiUrl}/${id}`, shoppingDetail);
  }

  // Desactivar un detalle de compra
  deactivateShoppingDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }

  // Activar un detalle de compra
  activateShoppingDetail(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, null);
  }
}
