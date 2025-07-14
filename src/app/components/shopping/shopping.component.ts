import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/services/shopping.service';
import { ShoppingDetailService } from 'src/app/services/shopping-detail.service';
import { Shopping } from 'src/app/models/shopping.model';
import { Router } from '@angular/router';
import { ShoppingDetail } from 'src/app/models/shopping-detail.model';
import { ExportService } from 'src/app/services/export.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  shoppings: Shopping[] = []; // Lista completa de compras
  filteredShoppings: Shopping[] = []; // Lista filtrada basada en la búsqueda
  searchText: string = ''; // Texto del buscador
  showActive: boolean = true; // Mostrar compras activas por defecto
  selectedShopping: Shopping | null = null; // Almacena la compra seleccionada para el modal

  constructor(
    private shoppingService: ShoppingService,
    private shoppingDetailService: ShoppingDetailService,
    private router: Router,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadShoppings(); // Cargar compras al iniciar
  }

  // Cargar las compras, dependiendo de si son activas o inactivas
  loadShoppings(): void {
    const shoppingObservable = this.showActive
      ? this.shoppingService.getAllActiveShoppings()
      : this.shoppingService.getAllInactiveShoppings();

    shoppingObservable.subscribe(
      (data: Shopping[]) => {
        this.shoppings = data.map(shopping => ({
          ...shopping,
          showDetails: false, // Inicializamos el flag showDetails en false
        }));
        this.filterShoppings(); // Aplicar el filtro después de cargar los datos
      },
      (error) => {
        console.error('Error fetching shoppings', error);
      }
    );
  }

  // Método para cargar los detalles de compra por ID
  loadShoppingDetails(shopping: Shopping): void {
    this.shoppingDetailService.getDetailsByShoppingId(shopping.id).subscribe(
      (details: ShoppingDetail[]) => {
        shopping.shoppingDetails = details; // Asignamos los detalles a la compra correspondiente
        this.selectedShopping = shopping; // Marcamos la compra seleccionada
      },
      (error) => {
        console.error('Error fetching shopping details', error);
      }
    );
  }

  // Filtrar compras según el texto de búsqueda
  filterShoppings(): void {
    if (this.searchText) {
      this.filteredShoppings = this.shoppings.filter(shopping =>
        shopping.client?.names.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredShoppings = [...this.shoppings];
    }
  }

  // Alternar la visibilidad de los detalles de la compra
  toggleDetails(shopping: Shopping): void {
    shopping.showDetails = !shopping.showDetails;  // Cambia el estado de showDetails
    if (shopping.showDetails && !shopping.shoppingDetails) {
      this.loadShoppingDetails(shopping); // Cargar detalles si no se han cargado aún
    }
    this.selectedShopping = shopping.showDetails ? shopping : null; // Establece la compra seleccionada si se están mostrando los detalles
  }

  // Alternar entre mostrar compras activas o inactivas
  toggleShoppingView(): void {
    this.loadShoppings();
  }

  // Crear una nueva compra
  createNewShopping(): void {
    this.router.navigate(['/compras/crear']);  // Redirige a la ruta correcta
  }

  // Editar una compra existente
  editShopping(shopping: Shopping): void {
    this.router.navigate(['/compras/editar', shopping.id]);  // Redirige a la ruta de edición con el ID de la compra
  }

  // Desactivar una compra
  deleteShopping(shoppingId: number): void {
    if (confirm('¿Está seguro de que desea desactivar esta compra?')) {
      this.shoppingService.deactivateShopping(shoppingId).subscribe(() => {
        this.loadShoppings(); // Recargar la lista después de desactivar
      });
    }
  }

  // Activar una compra
  activateShopping(shoppingId: number): void {
    this.shoppingService.activateShopping(shoppingId).subscribe(() => {
      this.loadShoppings();
    });
  }

  // Cerrar el modal sin cambiar el estado de los detalles
  closeModal(): void {
    this.selectedShopping = null; // Cierra el modal sin cambiar el estado de showDetails
  }

  // Exportar una compra específica a PDF
  exportShoppingToPdf(shopping: Shopping): void {
    this.shoppingDetailService.getDetailsByShoppingId(shopping.id).subscribe(
      (details: ShoppingDetail[]) => {
        this.exportService.exportShoppingToPdf(shopping, details);
      },
      error => {
        console.error('Error al obtener detalles para PDF:', error);
        Swal.fire('Error', 'No se pudieron obtener los detalles para el PDF', 'error');
      }
    );
  }

  // Exportar a Excel
  exportToExcel(): void {
    if (this.shoppings.length === 0) {
      Swal.fire('Error', 'No hay datos para exportar', 'error');
      return;
    }

    const data = this.shoppings.map(shopping => ({
      'ID': shopping.id,
      'Cliente': shopping.client?.names,
      'Fecha': new Date(shopping.shoppingDate).toLocaleDateString(),
      'Total': shopping.total,
      'Estado': shopping.status === 'A' ? 'Activo' : 'Inactivo'
    }));

    this.exportService.exportToExcel(data, 'compras');
  }

  // Exportar a CSV
  exportToCSV(): void {
    this.exportService.exportToCSV(this.filteredShoppings);
  }
}
