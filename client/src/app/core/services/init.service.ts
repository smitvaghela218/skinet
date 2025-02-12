import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { AccountService } from './account.service';
import { Cart } from '../../shared/models/cart';
import { User } from '../../shared/models/user';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private signalrService = inject(SignalrService);


  init(): Observable<{ cart: Cart | null; user: User; }> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);
    // return cart$;
    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo().pipe(
        tap(user => {
          if (user) this.signalrService.createHubConnection();
        })

      )
    })
  }

}
