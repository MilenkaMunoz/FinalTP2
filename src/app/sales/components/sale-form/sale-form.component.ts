import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sale } from '../../interfaces/sale.interface';
import { SaleDetail } from '../../interfaces/sale-detail.interface';
import { SaleService } from '../../services/sale.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent implements OnInit {
  sale: Sale = {
    saleCode: '',
    clientId: 0,
    clientName: '',
    paymentMethod: '',
    remarks: '',
    status: 'Registrado',
    details: []
  };

  isEdit: boolean = false;

  constructor(
    public saleService: SaleService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.saleService.getById(+id).subscribe(data => this.sale = data);
    }
  }

  addDetail() {
    this.sale.details.push({
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
  }

  removeDetail(index: number) {
    this.sale.details.splice(index, 1);
  }

  updateTotal(detail: SaleDetail) {
    detail.totalPrice = detail.quantity * detail.unitPrice;
  }

  onSubmit() {
    if (this.isEdit && this.sale.saleId) {
      this.saleService.update(this.sale.saleId, this.sale).subscribe(() => {
        this.router.navigate(['/dashboard/sales']);
      });
    } else {
      this.saleService.create(this.sale).subscribe(() => {
        this.router.navigate(['/dashboard/sales']);
      });
    }
  }
}
