import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { ShippingAddress } from '../models/order';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value?: ConfirmationToken['shipping'] | ShippingAddress, ...args: unknown[]): unknown {
    if (value && 'address' in value) {
      const { line1, line2, city, country, postal_code, state } = (value as ConfirmationToken['shipping'])?.address!;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, 
        ${city}, ${state}, ${postal_code}, ${country}`;
    }
    else if (value && 'line1' in value) {
      const { line1, line2, city, country, postalCode, state } = value as ShippingAddress;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, 
        ${city}, ${state}, ${postalCode}, ${country}`;
    }
    else {
      return 'Unknown address'
    }
  }

}
