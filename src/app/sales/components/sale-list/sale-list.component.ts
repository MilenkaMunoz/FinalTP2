import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale.interface';

@Component({
  selector: 'app-sale-list',
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
}
