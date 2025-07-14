import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Inventory } from 'src/app/models/inventory.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  inventories: Inventory[] = []; // Lista completa de inventarios
  filteredInventories: Inventory[] = []; // Lista filtrada
  showActive: boolean = true; // Alternar entre activos/inactivos
  searchText: string = ''; // Texto de búsqueda

  constructor(private inventoryService: InventoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  // Método para cargar inventarios
  loadInventories(): void {
    const inventoryObservable = this.showActive
      ? this.inventoryService.getAllActiveInventories()
      : this.inventoryService.getAllInactiveInventories();

    inventoryObservable.subscribe(
      (data: Inventory[]) => {
        this.inventories = data;
        this.filterInventories(); // Actualizar la lista filtrada
      },
      (error) => {
        console.error('Error fetching inventories', error);
      }
    );
  }

  // Método para filtrar inventarios
  filterInventories(): void {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredInventories = this.inventories.filter((inventory) =>
      inventory.product.productName.toLowerCase().includes(searchTerm)
    );
  }

  createNewInventory(): void {
    this.router.navigate(['/inventarios/crear']); // Redirige al formulario de creación
  }

  editInventory(inventory: Inventory): void {
    this.router.navigate(['/inventarios/editar', inventory.id]); // Redirige al formulario de edición
  }

  deleteInventory(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este inventario?')) {
      this.inventoryService.deactivateInventory(id).subscribe(
        () => this.loadInventories(),
        (error) => console.error('Error deactivating inventory', error)
      );
    }
  }

  activateInventory(id: number): void {
    this.inventoryService.activateInventory(id).subscribe(
      () => this.loadInventories(),
      (error) => console.error('Error activating inventory', error)
    );
  }

  // Alternar entre activos/inactivos y cargar inventarios
  toggleInventoryView(): void {
    this.loadInventories();
  }
}
