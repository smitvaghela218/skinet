import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  private shopService = inject(ShopService)
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.shopService.getProduct(+id).subscribe({
      next: product => this.product = product,
      error: error => console.log(error)
    })
  }


}
