import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-refund-button-renderer',
  standalone: true,
  imports: [MatIcon],
  template: `
<button matTooltip="Refund" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
(click)="openRefundOrderDialog()">
<mat-icon>undo</mat-icon>
</button>
  `
})
export class RefundButtonRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  async openRefundOrderDialog() {
    if (this.params.openRefundOrderDialog) {
      await this.params.openRefundOrderDialog(this.params.data.id);
    }
  }
}
