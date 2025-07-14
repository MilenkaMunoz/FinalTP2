import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/app/products';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos activos
  getAllActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/active`);
  }

  // Obtener todos los productos inactivos
  getAllInactiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/inactive`);
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Desactivar un producto (debe usar DELETE según el controlador)
  deactivateProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }

  // Activar un producto
  activateProduct(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, {});
  }
}
