import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'paymentCard',
  standalone: true
})
export class PaymentCardPipe implements PipeTransform {

  transform(value: ConfirmationToken['payment_method_preview']['card'], ...args: unknown[]): unknown {
    if (value) {
      const { brand, last4, exp_month, exp_year } = value
      // VISA **** **** **** 4242, Exp: 4/2028
      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }
    else {
      return 'Unknown payment method';
    }
  }

}
