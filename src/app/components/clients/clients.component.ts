import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = []; // Lista completa de clientes
  filteredClients: Client[] = []; // Lista de clientes filtrados para mostrar
  showActive: boolean = true; // Estado del listado (activos o inactivos)
  searchText: string = ''; // Texto del filtro de búsqueda

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Método para cargar clientes (activos o inactivos según 'showActive')
  loadClients(): void {
    const clientsObservable = this.showActive
      ? this.clientService.getAllActiveClients()
      : this.clientService.getAllInactiveClients();

    clientsObservable.subscribe(
      (data: Client[]) => {
        this.clients = data;
        this.filterClients(); // Aplica el filtro después de cargar los datos
      },
      (error) => {
        console.error('Error fetching clients', error);
      }
    );
  }

  // Método para aplicar el filtro de búsqueda
  filterClients(): void {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.names.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.cellPhone.toLowerCase().includes(searchTerm) ||
      client.address.toLowerCase().includes(searchTerm)
    );
  }

  createNewClient(): void {
    this.router.navigate(['/clientes/crear']);
  }

  editClient(client: Client): void {
    this.router.navigate(['/clientes/editar', client.id]);
  }

  deleteClient(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clientService.deactivateClient(id).subscribe(
        () => {
          this.loadClients();
          console.log('Cliente desactivado con éxito');
        },
        (error) => {
          console.error('Error al desactivar el cliente', error);
        }
      );
    }
  }

  activateClient(id: number): void {
    this.clientService.activateClient(id).subscribe(
      () => {
        this.loadClients();
        console.log('Cliente activado con éxito');
      },
      (error) => {
        console.error('Error al activar el cliente', error);
      }
    );
  }

  // Alternar entre los clientes activos e inactivos
  toggleClientView(): void {
    this.loadClients();
  }
}
