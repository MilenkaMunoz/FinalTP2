import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale.interface';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.saleService.getAll().subscribe(data => this.sales = data);
  }

  deleteSale(id: number) {
    if (confirm('¿Eliminar esta venta?')) {
      this.saleService.delete(id).subscribe(() => this.loadSales());
    }
  }

  viewDetail(id: number) {
    window.location.href = `/dashboard/sales/detail/${id}`;
  }
}
