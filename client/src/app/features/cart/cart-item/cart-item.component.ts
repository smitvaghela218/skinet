import { Component, inject, input } from '@angular/core';
import { Cart, CartItem } from '../../../shared/models/cart';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CurrencyPipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);
  private dialogService = inject(DialogService);

  async openRemoveItemDialog() {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove item'
    )

    if (confirmed) this.removeItemFromCart();
  }

  incrementQuantity() {
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity() {
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFromCart() {
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity);

  }

}
