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
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  private shopService = inject(ShopService)
  private activatedRoute = inject(ActivatedRoute);
  cartService = inject(CartService);

  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.product = product,
          this.updateQuantityInCart()
      },
      error: error => console.log(error)
    })

  }

  updateCart() {

    if (!this.product) {
      return
    }

    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
      if (this.quantity > this.cartService.maxQuantity) {
        this.quantity = this.cartService.maxQuantity;
        this.quantityInCart = this.cartService.maxQuantity;
      }
      // console.log('itemsToAdd ' + itemsToAdd + "quantity " + this.quantity + "this.quantityInCart " + this.quantityInCart);

    }

    else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }

  }

  updateQuantityInCart() {
    this.quantityInCart =
      this.cartService.cart()?.items.find(x => x.productId == this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }

}
