import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { AccountService } from '../../core/services/account.service';
import { CartService } from '../../core/services/cart.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { Address } from '../../shared/models/user';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    CurrencyPipe,
    // JsonPipe,
    MatStepper,
    MatStepperModule,
    OrderSummaryComponent,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private accountService = inject(AccountService);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>({ address: false, card: false, delivery: false });
  confirmationToken?: ConfirmationToken;
  loading = false;


  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');//attaches the Stripe element to the specified container, allowing it to display in the UI.
      this.addressElement.on('change', this.handleAddressChange)
      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');//attaches the Stripe element to the specified container, allowing it to display in the UI.
      this.paymentElement.on('change', this.handlePaymentChange)

    } catch (error: any) {
      this.snackbar.error(error.message);
    }
  }

  async onStepChange($event: StepperSelectionEvent) {
    if ($event.selectedIndex == 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && await firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if ($event.selectedIndex == 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if ($event.selectedIndex == 3) {
      await (this.getConfirmationToken());
    }
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(x => x == true)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) {
          throw new Error(result.error.message)
        }
        this.confirmationToken = result.confirmationToken;
        // console.log(this.confirmationToken);

      }
    } catch (error: any) {
      this.snackbar.error(error)
    }

  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken);
        if (result.error) {
          throw new Error(result.error.message);
        }
        else {
          this.cartService.deleteCart();
          this.router.navigateByUrl('/checkout/success');
        }
      }
    } catch (error: any) {
      this.snackbar.error(error.message || 'Something went wrong');
      stepper.previous();
    }
    finally {
      this.loading = false;
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state
    })
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state
    })
  }

  // when change the property of parent component from child componenet then we use the output signal from child component
  // and emmit from child
  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }

  private async getAddressFromStripeAddress(): Promise<null | Address> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;
    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      }
    }
    return null;
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {

    this.saveAddress = event.checked;
    // console.log(this.saveAddress);

  }
  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}


