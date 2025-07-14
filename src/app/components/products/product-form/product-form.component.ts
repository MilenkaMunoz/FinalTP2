import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  @ViewChild('productForm') productForm!: NgForm;

  // Modelo del producto inicializado con todos los campos necesarios
  product: Product = {
    id: 0,
    productCode: '',
    productName: '',
    description: '',
    purchasePrice: 0,
    price: 0,
    stock: 0,
    manufactureDate: undefined,
    expirationDate: undefined,
    category: {
      id: 0,
      categoryName: '',
      description: '',
      status: '',
    },
    status: 'A',
  };

  priceInput: string = '0.00';
  categories: Category[] = [];
  isEditMode: boolean = false;
  isPriceInvalid: boolean = false;

  // Bandera para manejar la validación del campo categoría
  categoryInvalid: boolean = true;
  categoryTouched: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode = true;
      this.productService.getProductById(Number(productId)).subscribe(
        (data: Product) => {
          this.product = data;
          this.priceInput = this.product.price.toFixed(2);
          this.syncProductCategory();
          this.validatePrice(); // Validar precio inicial
          this.validateCategory(); // Validar categoría inicial
        },
        (error) => this.toastr.error('Error al cargar el producto', 'Error')
      );
    }
  }

  loadCategories(): void {
    this.categoryService.getAllActiveCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.syncProductCategory();
      },
      (error) => this.toastr.error('Error al cargar las categorías', 'Error')
    );
  }

  syncProductCategory(): void {
    if (this.product.category && this.categories.length > 0) {
      const selectedCategory = this.categories.find(
        (category) => category.id === this.product.category.id
      );
      if (selectedCategory) {
        this.product.category = selectedCategory;
      }
    }
    this.validateCategory();
  }

  onPriceInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Filtrar caracteres no numéricos y restringir a dos decimales
    const numericValue = input.replace(/[^0-9.]/g, '');
    const decimalIndex = numericValue.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = numericValue.slice(0, decimalIndex);
      const decimalPart = numericValue.slice(decimalIndex + 1, decimalIndex + 3 + 1);
      this.priceInput = integerPart + '.' + decimalPart;
    } else {
      this.priceInput = numericValue;
    }
    this.validatePrice();
  }

  validatePrice(): void {
    this.isPriceInvalid = parseFloat(this.priceInput) <= 0;
  }

  validateCategory(): void {
    // Verifica si la categoría es válida
    this.categoryInvalid = !this.product.category || this.product.category.id === 0;
  }

  markCategoryTouched(): void {
    // Marca el campo como tocado
    this.categoryTouched = true;
  }

  submitForm(productForm: NgForm): void {
    productForm.form.markAllAsTouched();
    this.markCategoryTouched();

    // Variables para almacenar errores específicos
    let errorMessages: string[] = [];

    // Validar nombre del producto
    if (productForm.controls['productName']?.invalid) {
      if (productForm.controls['productName']?.errors?.['required']) {
        errorMessages.push('El nombre del producto es obligatorio.');
      }
      if (productForm.controls['productName']?.errors?.['minlength']) {
        errorMessages.push('El nombre del producto debe tener al menos 3 caracteres.');
      }
      if (productForm.controls['productName']?.errors?.['pattern']) {
        errorMessages.push('El nombre del producto solo puede contener letras y espacios.');
      }
    }

    // Validar descripción
    if (productForm.controls['description']?.invalid) {
      if (productForm.controls['description']?.errors?.['required']) {
        errorMessages.push('La descripción del producto es obligatoria.');
      }
      if (productForm.controls['description']?.errors?.['minlength']) {
        errorMessages.push('La descripción debe tener al menos 10 caracteres.');
      }
      if (productForm.controls['description']?.errors?.['pattern']) {
        errorMessages.push('La descripción solo puede contener letras y espacios.');
      }
    }

    // Validar precio
    if (this.isPriceInvalid) {
      errorMessages.push('El precio debe ser mayor que 0.00.');
    }

    if (productForm.controls['price']?.invalid) {
      if (productForm.controls['price']?.errors?.['required']) {
        errorMessages.push('El precio es obligatorio.');
      }
      if (productForm.controls['price']?.errors?.['pattern']) {
        errorMessages.push('El precio debe tener un formato válido (ej. 12.34).');
      }
    }

    // Validar stock
    if (productForm.controls['stock']?.invalid) {
      if (productForm.controls['stock']?.errors?.['required']) {
        errorMessages.push('El stock es obligatorio.');
      }
      if (productForm.controls['stock']?.errors?.['min']) {
        errorMessages.push('El stock debe ser al menos 1.');
      }
    }

    // Validar categoría
    if (this.categoryInvalid) {
      errorMessages.push('Debes seleccionar una categoría.');
    }

    // Validar fechas
    if (productForm.controls['manufactureDate']?.invalid) {
      errorMessages.push('La fecha de fabricación es obligatoria.');
    }

    if (productForm.controls['expirationDate']?.invalid) {
      errorMessages.push('La fecha de caducidad es obligatoria.');
    }

    if (this.product.expirationDate && this.product.manufactureDate && this.product.expirationDate < this.product.manufactureDate) {
      errorMessages.push('La fecha de caducidad no puede ser anterior a la fecha de fabricación.');
    }

    // Mostrar alerta si hay errores
    if (errorMessages.length > 0) {
      Swal.fire({
        title: 'Formulario incompleto o incorrecto',
        html: errorMessages.join('<br>'), // Mostrar errores en formato de lista
        icon: 'error',
      });
      return;
    }

    // Si pasa todas las validaciones
    Swal.fire({
      title: this.isEditMode ? '¿Actualizar producto?' : '¿Crear producto?',
      text: this.isEditMode
        ? 'Se actualizará la información del producto.'
        : 'Se creará un nuevo producto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.isEditMode ? 'Actualizar' : 'Crear',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveProduct();
      }
    });
  }

  saveProduct(): void {
    this.product.price = parseFloat(this.priceInput);

    // Ajustar las fechas para la zona horaria local
    if (this.product.manufactureDate) {
      const mDate = new Date(this.product.manufactureDate + 'T00:00:00');
      this.product.manufactureDate = mDate;
    }

    if (this.product.expirationDate) {
      const eDate = new Date(this.product.expirationDate + 'T00:00:00');
      this.product.expirationDate = eDate;
    }

    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(
        () => {
          Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
          this.router.navigate(['/productos']);
        },
        (error) => Swal.fire('Error', 'No se pudo actualizar el producto', 'error')
      );
    } else {
      this.productService.createProduct(this.product).subscribe(
        () => {
          Swal.fire('Éxito', 'Producto creado con éxito', 'success');
          this.router.navigate(['/productos']);
        },
        (error) => Swal.fire('Error', 'No se pudo crear el producto', 'error')
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}
