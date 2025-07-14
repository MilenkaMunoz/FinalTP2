import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/app/clients';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes activos
  getAllActiveClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/active`);
  }

  // Obtener todos los clientes inactivos
  getAllInactiveClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/inactive`);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // Obtener un cliente por su ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un cliente existente
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  // Activar un cliente existente (usando PUT)
  activateClient(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, {});
  }

  // Desactivar un cliente existente (usando DELETE)
  deactivateClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deactivate/${id}`);
  }
}
