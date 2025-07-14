import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderDetail } from '../../models/order-detail.model';
import { OrderService } from '../../services/order.service';
import { OrderDetailService } from '../../services/order-detail.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  showForm = false;
  isEditing = false;

  constructor(
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getActiveOrders().subscribe({
      next: (data: Order[]) => {
        console.log('Datos recibidos:', data);
        this.orders = data;
      },
      error: (error: any) => {
        console.error('Error al cargar las órdenes:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las órdenes',
          icon: 'error'
        });
      }
    });
  }

  openCreateForm(): void {
    this.selectedOrder = null;
    this.isEditing = false;
    this.showForm = true;
  }

  editOrder(order: Order): void {
    if (order && order.id) {
      this.router.navigate(['/ordenes/editar', order.id]);
    }
  }

  closeForm(): void {
    this.selectedOrder = null;
    this.showForm = false;
    this.isEditing = false;
  }

  onOrderSaved(): void {
    this.loadOrders();
    this.closeForm();
  }

  deactivateOrder(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará la orden',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deactivateOrder(id).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Orden desactivada correctamente', 'success');
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error deactivating order:', error);
            Swal.fire('Error', 'No se pudo desactivar la orden', 'error');
          }
        });
      }
    });
  }
}
