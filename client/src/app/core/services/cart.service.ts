import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  minQuantity = 0;
  maxQuantity = 10;
  private snackbar = inject(SnackbarService);
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  })
  selectedDelivery = signal<DeliveryMethod | null>(null);
  totals = computed(() => {
    const delivery = this.selectedDelivery();
    const cart = this.cart();
    if (!cart) {
      return null;
    }
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  })

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        console.log(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => {
        this.cart.set(cart)
        console.log(cart);

      }
    })
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) {
      return;
    }
    const index = cart.items.findIndex(x => x.productId == productId);
    if (index != -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      }
      else {
        cart.items.splice(index, 1);
      }
      if (cart.items.length == 0) {
        this.deleteCart();
      }
      else {
        this.setCart(cart);
      }

    }
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
        this.selectedDelivery.set(null);
      }
    })
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    // console.log(this.cart());

    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    var CartItems = this.addOrUpdateItem(cart.items, item, quantity);
    if (CartItems) {
      cart.items = CartItems;
      this.setCart(cart);
    }
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] | null {
    // console.log("addOrUpdateItem ");
    // console.log("quantity " + quantity);

    const index = items.findIndex(x => x.productId == item.productId);

    if (quantity > this.maxQuantity || (index != -1 && items[index].quantity + quantity > this.maxQuantity)) {

      this.snackbar.error(`Max ${this.maxQuantity}  Qty Buy Of Any Product `);
    }

    if (index == -1) {
      item.quantity = quantity >= this.maxQuantity ? this.maxQuantity : quantity;
      items.push(item);
    }

    else {
      if (items[index].quantity == this.maxQuantity) {
        return null;
      } else if (items[index].quantity + quantity >= this.maxQuantity) {
        items[index].quantity = this.maxQuantity;
      } else {
        items[index].quantity += quantity;
      }
    }

    return items;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }
  // type guard
  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id != undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id)
    return cart;
  }

}


