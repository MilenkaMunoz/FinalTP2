import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Order } from '../../../models/order.model';
import { OrderDetail } from '../../../models/order-detail.model';
import { OrderRequest } from '../../../models/order-request.model';
import { OrderService } from '../../../services/order.service';
import { ClientService } from '../../../services/client.service';
import { ProductService } from '../../../services/product.service';
import { Client } from '../../../models/client.model';
import { Product } from '../../../models/product.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderDetailService } from '../../../services/order-detail.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  @Input() order: Order | null = null;
  @Input() isEditing = false;
  @Output() orderSaved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  orderForm: FormGroup = this.createForm();
  clients: Client[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private clientService: ClientService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private orderDetailService: OrderDetailService
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    
    // Obtener el ID de la orden de los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.loadOrder(params['id']);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      clientId: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      orderDate: ['', Validators.required],
      deliveryDate: [''],
      status: ['Pending'],
      total: [{ value: 0, disabled: true }],
      orderDetails: this.fb.array([])
    });
  }

  private populateForm(): void {
    if (this.order) {
      console.log('Populando formulario con:', this.order);
      
      // Actualizar los campos básicos del formulario
      this.orderForm.patchValue({
        clientId: this.order.client?.id,
        deliveryAddress: this.order.deliveryAddress,
        orderDate: this.formatDate(this.order.orderDate),
        status: this.order.status || 'Pending',
        total: this.order.totalAmount
      });

      // Limpiar y agregar los detalles existentes
      const detailsArray = this.orderForm.get('orderDetails') as FormArray;
      detailsArray.clear();
      
      if (this.order.orderDetails && this.order.orderDetails.length > 0) {
        console.log('Agregando detalles de la orden:', this.order.orderDetails);
        
        this.order.orderDetails.forEach(detail => {
          const detailForm = this.fb.group({
            productId: [detail.product?.id, Validators.required],
            quantity: [detail.quantity, [Validators.required, Validators.min(1)]],
            unitPrice: [{ value: detail.unitPrice, disabled: true }],
            subtotal: [{ value: detail.quantity * detail.unitPrice, disabled: true }]
          });

          // Suscribirse a cambios en la cantidad para recalcular subtotales
          detailForm.get('quantity')?.valueChanges.subscribe(() => {
            this.calculateSubtotal(detailForm);
          });

          detailsArray.push(detailForm);
        });

        // Calcular el total inicial
        this.calculateTotal();
      }
    }
  }

  get orderDetails(): FormArray {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  private setupDetailObservables(detailForm: FormGroup): void {
    // Observable para cambios en el producto
    detailForm.get('productId')?.valueChanges.subscribe(productId => {
      const product = this.products.find(p => p.id === Number(productId));
      if (product) {
        detailForm.patchValue({
          unitPrice: product.price
        }, { emitEvent: false });
        this.calculateSubtotal(detailForm);
      }
    });

    // Observable para cambios en la cantidad
    detailForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateSubtotal(detailForm);
    });
  }

  addOrderDetail(): void {
    const detailForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }]
    });

    this.setupDetailObservables(detailForm);
    (this.orderForm.get('orderDetails') as FormArray).push(detailForm);
    this.calculateTotal();
  }

  private calculateSubtotal(detailForm: FormGroup): void {
    const quantity = detailForm.get('quantity')?.value || 0;
    const unitPrice = detailForm.get('unitPrice')?.value || 0;
    const subtotal = quantity * unitPrice;
    
    console.log('Calculando subtotal:', { quantity, unitPrice, subtotal });
    
    detailForm.patchValue({
      subtotal: subtotal
    }, { emitEvent: false });

    this.calculateTotal();
  }

  private calculateTotal(): void {
    const details = this.orderForm.get('orderDetails') as FormArray;
    const total = details.controls.reduce((sum, detail) => {
      const subtotal = detail.get('subtotal')?.value || 0;
      console.log('Sumando al total:', subtotal);
      return sum + subtotal;
    }, 0);

    console.log('Total calculado:', total);
    
    this.orderForm.patchValue({
      total: total
    }, { emitEvent: false });
  }

  removeOrderDetail(index: number): void {
    (this.orderForm.get('orderDetails') as FormArray).removeAt(index);
    this.calculateTotal();
  }

  private loadClients() {
    this.clientService.getAllActiveClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error: any) => {
        console.error('Error loading clients:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los clientes',
          icon: 'error'
        });
      }
    });
  }

  private loadProducts(): void {
    this.productService.getAllActiveProducts().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los productos',
          icon: 'error'
        });
      }
    });
  }

  private loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        console.log('Orden cargada:', order);
        this.order = order;
        this.populateForm();
      },
      error: (error) => {
        console.error('Error al cargar la orden:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la orden',
          icon: 'error'
        });
        this.router.navigate(['/ordenes']);
      }
    });
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    // Formato ISO con hora específica para evitar problemas de zona horaria
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.getRawValue();
      
      // Crear los detalles de la orden con el nuevo formato
      const details = formValue.orderDetails.map((detail: { productId: number; quantity: number; unitPrice: number }) => ({
        productId: Number(detail.productId),
        quantity: Number(detail.quantity),
        unitPrice: Number(detail.unitPrice)
      }));

      // Crear el objeto OrderRequest con la nueva estructura
      const orderRequest: OrderRequest = {
        client: Number(formValue.clientId),
        deliveryAddress: formValue.deliveryAddress,
        orderDate: this.formatDate(formValue.orderDate),
        deliveryDate: this.formatDate(formValue.deliveryDate || new Date()),
        status: formValue.status || 'PENDING',
        active: 'A',
        details: details
      };

      console.log('Enviando orden:', orderRequest);

      if (this.isEditing && this.order?.id) {
        // Actualizar orden existente
        this.orderService.updateOrder(this.order.id, orderRequest).subscribe({
          next: (updatedOrder) => {
            console.log('Orden actualizada:', updatedOrder);
            Swal.fire({
              title: 'Éxito',
              text: 'Orden actualizada correctamente',
              icon: 'success'
            });
            this.orderSaved.emit();
            this.router.navigate(['/ordenes']);
          },
          error: (error) => {
            console.error('Error al actualizar la orden:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error: ' + (error.error?.message || 'No se pudo actualizar la orden'),
              icon: 'error'
            });
          }
        });
      } else {
        // Crear nueva orden
        this.orderService.createOrder(orderRequest).subscribe({
          next: (newOrder) => {
            console.log('Orden creada:', newOrder);
            Swal.fire({
              title: 'Éxito',
              text: 'Orden creada correctamente',
              icon: 'success'
            });
            this.orderSaved.emit();
            this.router.navigate(['/ordenes']);
          },
          error: (error) => {
            console.error('Error al crear la orden:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error: ' + (error.error?.message || 'No se pudo crear la orden'),
              icon: 'error'
            });
          }
        });
      }
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
