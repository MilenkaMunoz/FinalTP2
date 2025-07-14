import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shopping } from '../models/shopping.model';
import { ShoppingDetail } from '../models/shopping-detail.model'; // Importamos también ShoppingDetail

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private apiUrl = 'http://localhost:8080/app/shopping'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) { }

  // Obtener todas las compras activas
  getAllActiveShoppings(): Observable<Shopping[]> {
    return this.http.get<Shopping[]>(`${this.apiUrl}/active`);
  }

  // Obtener todas las compras inactivas
  getAllInactiveShoppings(): Observable<Shopping[]> {
    return this.http.get<Shopping[]>(`${this.apiUrl}/inactive`);
  }

  // Obtener una compra por ID
  getShoppingById(id: number): Observable<Shopping> {
    return this.http.get<Shopping>(`${this.apiUrl}/${id}`);
  }

  createShopping(shoppingData: Shopping, shoppingDetails: ShoppingDetail[] = []): Observable<Shopping> {
    const body = { shopping: shoppingData, shoppingDetails };
    console.log('Creando compra con datos:', body);
    return this.http.post<Shopping>(this.apiUrl, body);
  }

  // Método para crear los detalles de la compra
  createShoppingDetails(shoppingDetails: ShoppingDetail[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/details`, shoppingDetails);
  }

  updateShopping(id: number, shoppingData: Shopping, shoppingDetails: ShoppingDetail[] = []): Observable<Shopping> {
    const body = { shopping: shoppingData, shoppingDetails };
    console.log('Actualizando compra con datos:', body);
    return this.http.put<Shopping>(`${this.apiUrl}/${id}`, body);
  }

  // Obtener los detalles de la compra por ID (ajustado a la lógica del backend)
  getShoppingDetailById(shoppingId: number): Observable<ShoppingDetail[]> {
    return this.http.get<ShoppingDetail[]>(`${this.apiUrl}/${shoppingId}/details`);
  }

  // Activar una compra
  activateShopping(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, null);
  }

  // Desactivar una compra
  deactivateShopping(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }

  // Función para agregar detalles a una compra
  addShoppingDetails(shoppingId: number, details: ShoppingDetail[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${shoppingId}/details`, details);
  }
}
