import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductService } from 'src/app/services/product.service';
import { Inventory } from 'src/app/models/inventory.model';
import { Product } from 'src/app/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  products: Product[] = [];
  isEditMode: boolean = false;
  inventory: Inventory | undefined;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.inventoryForm = this.fb.group({
      product: [null, Validators.required],
      movementQuantity: [0, [Validators.required, Validators.min(1)]],
      movementType: ['Ingreso', Validators.required],
      movementDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    const inventoryId = this.route.snapshot.paramMap.get('id');
    if (inventoryId) {
      this.isEditMode = true;
      this.inventoryService.getInventoryById(Number(inventoryId)).subscribe(
        (data: Inventory) => {
          this.inventory = data;
          this.inventoryForm.patchValue({
            product: data.product,
            movementQuantity: data.movementQuantity,
            movementType: data.movementType,
            movementDate: new Date(data.movementDate).toISOString().split('T')[0] // Set formatted date
          });
        },
        (error) => console.error('Error fetching inventory', error)
      );
    }
  }

  loadProducts(): void {
    this.productService.getAllActiveProducts().subscribe(
      (data: Product[]) => this.products = data,
      (error) => console.error('Error fetching products', error)
    );
  }

  saveInventory(): void {
    if (this.inventoryForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos.', 'error');
      return;
    }

    const inventoryToSave: Inventory = {
      ...this.inventory,
      ...this.inventoryForm.value,
      movementDate: new Date(this.inventoryForm.value.movementDate)
    };

    if (!this.isEditMode) {
      inventoryToSave.status = 'A';
      this.inventoryService.createInventory(inventoryToSave).subscribe(
        () => {
          Swal.fire('Éxito', 'Inventario creado exitosamente.', 'success');
          this.router.navigate(['/inventarios']);
        },
        (error) => Swal.fire('Error', 'Error al crear el inventario.', 'error')
      );
    } else {
      this.inventoryService.updateInventory(inventoryToSave.id!, inventoryToSave).subscribe(
        () => {
          Swal.fire('Éxito', 'Inventario actualizado exitosamente.', 'success');
          this.router.navigate(['/inventarios']);
        },
        (error) => Swal.fire('Error', 'Error al actualizar el inventario.', 'error')
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/inventarios']);
  }
}
