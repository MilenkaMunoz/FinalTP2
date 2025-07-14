import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:8080/app/inventory';

  constructor(private http: HttpClient) {}

  getAllActiveInventories(): Observable<Inventory[]> {  // Cambiado a plural para coincidir con el componente
    return this.http.get<Inventory[]>(`${this.apiUrl}/active`);
  }

  getAllInactiveInventories(): Observable<Inventory[]> {  // Cambiado a plural para coincidir con el componente
    return this.http.get<Inventory[]>(`${this.apiUrl}/inactive`);
  }

  getInventoryById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  createInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, inventory);
  }

  updateInventory(id: number, inventory: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/${id}`, inventory);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateInventory(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, null);
  }

  // Desactivar inventario (ahora usa DELETE)
  deactivateInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }
}
