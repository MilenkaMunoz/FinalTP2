import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  showActive: boolean = true;
  searchText: string = '';

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Cargar categorías activas o inactivas según el estado actual.
   */
  loadCategories(): void {
    const categoryObservable = this.showActive
      ? this.categoryService.getAllActiveCategories()
      : this.categoryService.getAllInactiveCategories();

    categoryObservable.subscribe((data) => {
      this.categories = data;
      this.filterCategories();
    });
  }

  /**
   * Filtrar categorías según el texto de búsqueda.
   */
  filterCategories(): void {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter((category) =>
      category.categoryName.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Navegar a la pantalla de creación de categoría.
   */
  createNewCategory(): void {
    this.router.navigate(['/categorias/crear']);
  }

  /**
   * Navegar a la pantalla de edición con confirmación.
   * @param category Categoría a editar.
   */
  editCategory(category: Category): void {
    Swal.fire({
      title: 'Editar Categoría',
      text: `¿Deseas editar la categoría "${category.categoryName}"?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/categorias/editar', category.id]);
      }
    });
  }

  /**
   * Desactivar una categoría con confirmación.
   * @param id ID de la categoría a desactivar.
   */
  deactivateCategory(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará la categoría.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deactivateCategory(id).subscribe(
          () => {
            this.loadCategories();
            Swal.fire('Desactivada', 'La categoría fue desactivada con éxito.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo desactivar la categoría.', 'error');
          }
        );
      }
    });
  }

  /**
   * Activar una categoría con confirmación.
   * @param id ID de la categoría a activar.
   */
  activateCategory(id: number): void {
    Swal.fire({
      title: '¿Activar Categoría?',
      text: 'Esta acción activará la categoría.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.activateCategory(id).subscribe(
          () => {
            this.loadCategories();
            Swal.fire('Activada', 'La categoría fue activada con éxito.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo activar la categoría.', 'error');
          }
        );
      }
    });
  }

  /**
   * Alternar entre la vista de categorías activas/inactivas.
   */
  toggleCategoryView(): void {
    this.loadCategories();
  }

    /**
   * Exportar las categorías visibles a un archivo PDF.
   */
    exportToPDF(): void {
      const doc = new jsPDF();
  
      // Título
      const title = this.showActive ? 'Categorías Activas' : 'Categorías Inactivas';
      doc.text(title, 10, 10);
  
      // Datos para la tabla
      const tableData = this.filteredCategories.map((category, index) => [
        index + 1,
        category.categoryName,
        category.description,
      ]);
  
      // Configuración de la tabla
      autoTable(doc, {
        head: [['#', 'Nombre', 'Descripción']],
        body: tableData,
        startY: 20,
      });
  
      // Descargar el archivo PDF
      doc.save(`${title}.pdf`);
    }
  
    /**
     * Exportar las categorías visibles a un archivo Excel.
     */
    exportToExcel(): void {
      const title = this.showActive ? 'Categorías_Activas' : 'Categorías_Inactivas';
  
      // Datos para el Excel
      const worksheetData = this.filteredCategories.map((category) => ({
        '#': this.filteredCategories.indexOf(category) + 1,
        Nombre: category.categoryName,
        Descripción: category.description,
      }));
  
      // Crear la hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
      // Exportar el archivo
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, title);
    }
  
    /**
     * Guardar el archivo Excel.
     * @param buffer Contenido del archivo.
     * @param fileName Nombre del archivo.
     */
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      FileSaver.saveAs(data, `${fileName}.xlsx`);
    }
}
