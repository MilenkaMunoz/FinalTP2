import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    productCode: '',
    productName: '',
    description: '',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    category: '',
    status: 'Activo'
  };

  isEdit: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productService.getById(+id).subscribe(data => this.product = data);
    }
  }

  onSubmit() {
    if (this.isEdit && this.product.productId) {
      this.productService.update(this.product.productId, this.product).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(this.product).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
