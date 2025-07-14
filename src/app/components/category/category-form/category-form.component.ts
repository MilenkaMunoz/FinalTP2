import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  @ViewChild('categoryForm') categoryForm!: NgForm;

  category: Category = {
    id: 0,
    categoryName: '',
    description: '', // Campo agregado
    status: 'A',
  };

  isEditMode: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.isEditMode = true;
      this.categoryService.getCategoryById(Number(categoryId)).subscribe(
        (data: Category) => (this.category = data),
        (error) => Swal.fire('Error', 'Error al cargar la categoría.', 'error')
      );
    }
  }

  submitForm(): void {
    this.categoryForm.form.markAllAsTouched();

    if (this.categoryForm.invalid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios correctamente.', 'error');
      return;
    }

    this.isEditMode ? this.updateCategory() : this.createCategory();
  }

  private createCategory(): void {
    this.categoryService.createCategory(this.category).subscribe(
      () => {
        Swal.fire('Éxito', 'Categoría creada con éxito.', 'success');
        this.router.navigate(['/categorias']);
      },
      (error) => Swal.fire('Error', 'No se pudo crear la categoría.', 'error')
    );
  }

  private updateCategory(): void {
    this.categoryService.updateCategory(this.category.id, this.category).subscribe(
      () => {
        Swal.fire('Éxito', 'Categoría actualizada con éxito.', 'success');
        this.router.navigate(['/categorias']);
      },
      (error) => Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error')
    );
  }

  cancel(): void {
    this.router.navigate(['/categorias']);
  }
}
