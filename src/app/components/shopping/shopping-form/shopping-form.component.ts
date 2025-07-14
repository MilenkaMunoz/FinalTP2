import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ShoppingService } from 'src/app/services/shopping.service';
import { ShoppingDetailService } from 'src/app/services/shopping-detail.service';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';
import { Client } from 'src/app/models/client.model';
import { Product } from 'src/app/models/product.model';
import { ShoppingDetailImpl } from 'src/app/models/shopping-detail.model';
import { Shopping } from 'src/app/models/shopping.model';

import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit {
  shoppingForm: FormGroup;
  clients: Client[] = [];
  products: Product[] = [];
  isEditMode = false;
  shoppingId?: number;

  constructor(
    private fb: FormBuilder,
    private shoppingService: ShoppingService,
    private shoppingDetailService: ShoppingDetailService,
    private clientService: ClientService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.shoppingForm = this.fb.group({
      client: [null, Validators.required],
      shoppingDate: ['', Validators.required],
      shoppingDetailsForm: this.fb.group({
        shoppingDetails: this.fb.array([], [this.hasAtLeastOneDetailValidator]),
        total: [{ value: 0, disabled: true }],
      }),
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.shoppingId = params['id'];
        this.loadShoppingData();
      }
    });
  }

  loadClients(): void {
    this.clientService.getAllActiveClients().subscribe(data => {
      this.clients = data;
      console.log('Clientes cargados:', this.clients);
    });
  }

  loadProducts(): void {
    this.productService.getAllActiveProducts().subscribe(data => {
      this.products = data;
      console.log('Productos cargados:', this.products);
    });
  }

  loadShoppingData(): void {
    if (this.shoppingId) {
      this.shoppingService.getShoppingById(this.shoppingId).subscribe(
        shopping => {
          if (shopping) {
            console.log('Datos de compra cargados:', shopping);

            // Convertir la fecha al formato adecuado (yyyy-MM-dd)
            const shoppingDate = shopping.shoppingDate
            ? new Date(new Date(shopping.shoppingDate).toLocaleString("en-US", { timeZone: "America/Lima" })).toISOString().split('T')[0]
            : '';

            // Buscar el cliente completo usando el ID
            const client = this.clients.find(c => c.id === shopping.client.id);

            // Asignar cliente completo al formulario
            this.shoppingForm.patchValue({
              client: client,  // Asigna el cliente completo al formulario
              shoppingDate: shoppingDate,
            });

            // Limpiar el FormArray antes de llenarlo
            const shoppingDetailsArray = this.shoppingForm.get('shoppingDetailsForm.shoppingDetails') as FormArray;
            shoppingDetailsArray.clear();

            // Ahora, obtenemos los detalles de la compra
            this.shoppingDetailService.getDetailsByShoppingId(this.shoppingId!).subscribe(
              shoppingDetails => {
                if (shoppingDetails && shoppingDetails.length > 0) {
                  console.log('Detalles de compra cargados:', shoppingDetails);

                  shoppingDetails.forEach((detail: any) => {
                    const product = this.products.find(p => p.id === detail.product.id);

                    // Verifica si el detalle se está agregando correctamente al FormArray
                    shoppingDetailsArray.push(this.createShoppingDetailFormGroup({
                      id: detail.id,  // Añadir el ID del detalle si existe
                      product: product || null,
                      quantity: detail.quantity,
                      unitPrice: detail.unitPrice,
                      subtotal: detail.quantity * detail.unitPrice,
                    }));

                    console.log('Detalle añadido al FormArray:', detail);
                  });
                } else {
                  console.log('No hay detalles de compra para cargar.');
                }

                // Actualizar el total después de cargar los detalles
                this.updateTotal();
              },
              error => {
                Swal.fire('Error', 'Ocurrió un error al cargar los detalles de la compra.', 'error');
              }
            );
          } else {
            Swal.fire('Error', 'No se encontraron datos para esta compra.', 'error');
          }
        },
        error => {
          Swal.fire('Error', 'Ocurrió un error al cargar los datos de la compra.', 'error');
        }
      );
    }
  }

  createShoppingDetailFormGroup(detail?: any): FormGroup {
    return this.fb.group({
      id: [detail?.id || null],
      product: [detail?.product || null, Validators.required],
      quantity: [detail?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [detail?.unitPrice || 0, [Validators.required, Validators.min(0.01)]],
      subtotal: [{ value: detail ? detail.quantity * detail.unitPrice : 0, disabled: true }],  // Establece el subtotal aquí
    });
  }

  get shoppingDetails(): FormArray<FormGroup> {
    return this.shoppingForm.get('shoppingDetailsForm.shoppingDetails') as FormArray<FormGroup>;
  }

  addShoppingDetail(): void {
    const shoppingDetail = this.createShoppingDetailFormGroup();
    this.shoppingDetails.push(shoppingDetail);

    shoppingDetail.get('quantity')?.valueChanges.subscribe(() => this.updateSubtotal(shoppingDetail));
    shoppingDetail.get('unitPrice')?.valueChanges.subscribe(() => this.updateSubtotal(shoppingDetail));
  }

  removeShoppingDetail(index: number): void {
    this.shoppingDetails.removeAt(index);
    this.updateTotal();
  }

  updateSubtotal(detailGroup: FormGroup): void {
    const quantity = detailGroup.get('quantity')?.value;
    const unitPrice = detailGroup.get('unitPrice')?.value;
    const subtotal = quantity * unitPrice;

    detailGroup.patchValue({ subtotal: subtotal }, { emitEvent: false });
    this.updateTotal();
  }

  updateTotal(): void {
    let total = 0;
    this.shoppingDetails.controls.forEach(detail => {
      const subtotal = detail.get('subtotal')?.value || 0;
      total += subtotal;
    });

    this.shoppingForm.get('shoppingDetailsForm.total')?.enable();  // Habilitar temporalmente
    this.shoppingForm.get('shoppingDetailsForm.total')?.patchValue(total);
    this.shoppingForm.get('shoppingDetailsForm.total')?.disable();  // Deshabilitar nuevamente
  }

  saveShopping(): void {
    if (this.shoppingForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const total = this.calculateTotal();  // Calcular total solo en el frontend
    console.log('Total calculado:', total);

    // Obtener los detalles del formulario
    const shoppingDetails = this.shoppingDetails.value;
    console.log('Detalles de compra extraídos del formulario:', shoppingDetails);

    const formValue = this.shoppingForm.value;
    const shoppingDate = new Date(formValue.shoppingDate);
    shoppingDate.setMinutes(shoppingDate.getMinutes() + shoppingDate.getTimezoneOffset());

    const shoppingData = {
      ...this.shoppingForm.value,
      shoppingDate: shoppingDate,
      total: total,  // Enviar el total calculado desde el frontend
      shoppingDetails: shoppingDetails,  // Asegúrate de que aquí se estén enviando correctamente los detalles
      status: 'A',
    };

    console.log('Datos de compra a guardar:', shoppingData);

    if (this.isEditMode) {
      this.shoppingService.updateShopping(this.shoppingId!, shoppingData).subscribe(
        (savedShopping: any) => {
          Swal.fire('Éxito', 'Compra actualizada con éxito', 'success');
          this.updateShoppingDetails(savedShopping.id);
          this.router.navigate(['/shopping']);  // Redirige a la vista de compras
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al actualizar la compra.', 'error');
        }
      );
    } else {
      this.shoppingService.createShopping(shoppingData).subscribe(
        (savedShopping: any) => {
          Swal.fire('Éxito', 'Compra creada con éxito', 'success');
          this.updateShoppingDetails(savedShopping.id);
          this.router.navigate(['/shopping']);  // Redirige a la vista de compras
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al crear la compra.', 'error');
        }
      );
    }
  }

  updateShoppingDetails(shoppingId: number): void {
    const shoppingDetails: ShoppingDetailImpl[] = this.shoppingDetails.value.map((detail: any) => {
      const shopping = { id: shoppingId } as Shopping;

      return new ShoppingDetailImpl(
        detail.id || 0,
        shopping,
        detail.product,
        detail.quantity,
        detail.unitPrice,
        'A'
      );
    });

    shoppingDetails.forEach((detail) => {
      if (detail.id !== 0) {
        this.shoppingDetailService.updateShoppingDetail(detail.id, detail).subscribe(
          () => {
            console.log(`Detalle de compra ${detail.id} actualizado correctamente`);
          },
          (error) => {
            console.error(`Error al actualizar detalle de compra ${detail.id}:`, error);
            Swal.fire('Error', 'Ocurrió un error al actualizar los detalles de la compra.', 'error');
          }
        );
      } else {
        this.shoppingDetailService.createShoppingDetail(detail).subscribe(
          (createdDetail: any) => {
            console.log(`Detalle de compra creado correctamente: ${createdDetail.id}`);
          },
          (error) => {
            console.error('Error al crear detalle de compra:', error);
            Swal.fire('Error', 'Ocurrió un error al crear un nuevo detalle de compra.', 'error');
          }
        );
      }
    });
  }

  calculateTotal(): number {
    let total = 0;
    this.shoppingDetails.controls.forEach(detail => {
      const subtotal = detail.get('subtotal')?.value || 0;
      total += subtotal;
    });
    return total;
  }

  cancel(): void {
    this.router.navigate(['/shopping']);
  }

  // Validador para asegurarse de que haya al menos un detalle
  hasAtLeastOneDetailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control instanceof FormArray) {
      return control.length > 0 ? null : { noDetails: true };
    }
    return null;
  }
}
