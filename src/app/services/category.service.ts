import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/app/categories';

  constructor(private http: HttpClient) {}

  getAllActiveCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/active`);
  }

  getAllInactiveCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/inactive`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateCategory(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, null);
  }

  deactivateCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }  
}
