import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = []; // Lista completa de productos
  filteredProducts: Product[] = []; // Lista filtrada basada en la búsqueda
  searchText: string = ''; // Texto de búsqueda
  showActive: boolean = true; // Estado para alternar entre productos activos/inactivos

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Cargar productos activos o inactivos según el estado actual.
   */
  loadProducts(): void {
    const productObservable = this.showActive
      ? this.productService.getAllActiveProducts()
      : this.productService.getAllInactiveProducts();

    productObservable.subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filterProducts(); // Filtrar los productos cargados
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  /**
   * Filtrar productos según el texto ingresado en el buscador.
   */
  filterProducts(): void {
    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredProducts = this.products.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Navegar a la pantalla de creación de productos.
   */
  createNewProduct(): void {
    this.router.navigate(['/productos/crear']);
  }

  /**
   * Navegar a la pantalla de edición de productos.
   * @param product Producto a editar.
   */
  editProduct(product: Product): void {
    this.router.navigate(['/productos/editar', product.id]);
  }

  /**
   * Desactivar un producto con confirmación.
   * @param id ID del producto a desactivar.
   */
  deleteProduct(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará el producto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deactivateProduct(id).subscribe(
          () => {
            this.loadProducts();
            Swal.fire('Desactivado', 'Producto desactivado con éxito.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo desactivar el producto.', 'error');
          }
        );
      }
    });
  }

  /**
   * Activar un producto con confirmación.
   * @param id ID del producto a activar.
   */
  activateProduct(id: number): void {
    Swal.fire({
      title: '¿Activar producto?',
      text: 'Esta acción activará el producto.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.activateProduct(id).subscribe(
          () => {
            this.loadProducts();
            Swal.fire('Activado', 'Producto activado con éxito.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo activar el producto.', 'error');
          }
        );
      }
    });
  }

  /**
   * Alternar entre la vista de productos activos e inactivos.
   */
  toggleProductView(): void {
    this.loadProducts();
  }

  /**
   * Exportar productos visibles a un archivo PDF.
   */
  exportToPDF(): void {
    const doc = new jsPDF();

    // Título del PDF
    const title = this.showActive ? 'Productos Activos' : 'Productos Inactivos';
    doc.text(title, 10, 10);

    // Preparar datos para la tabla
    const tableData = this.filteredProducts.map((product, index) => [
      index + 1,
      product.productName || 'Sin Nombre',
      product.category?.categoryName || 'Sin Categoría',
      product.description || 'Sin Descripción',
      product.price?.toFixed(2) || '0.00',
      product.stock || 0,
      product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString() : 'No especificado',
      product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'No especificado',
    ]);

    // Configuración de la tabla
    autoTable(doc, {
      head: [
        [
          '#',
          'Nombre',
          'Categoría',
          'Descripción',
          'Precio',
          'Stock',
          'Fabricación',
          'Caducidad',
        ],
      ],
      body: tableData,
      startY: 20,
    });

    // Descargar archivo PDF
    doc.save(`${title}.pdf`);
  }

  /**
   * Exportar productos visibles a un archivo Excel.
   */
  exportToExcel(): void {
    const title = this.showActive ? 'Productos_Activos' : 'Productos_Inactivos';

    // Preparar datos para Excel
    const worksheetData = this.filteredProducts.map((product, index) => ({
      '#': index + 1,
      Nombre: product.productName || 'Sin Nombre',
      Categoría: product.category?.categoryName || 'Sin Categoría',
      Descripción: product.description || 'Sin Descripción',
      Precio: product.price?.toFixed(2) || '0.00',
      Stock: product.stock || 0,
      Fabricación: product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString() : 'No especificado',
      Caducidad: product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'No especificado',
    }));

    // Crear hoja de trabajo para Excel
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // Generar y guardar archivo Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, title);
  }

  /**
   * Guardar el archivo Excel generado.
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
