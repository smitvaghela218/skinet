import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { AdminService } from '../../../core/services/admin.service';
import { DialogService } from '../../../core/services/dialog.service';
import { OrderParams } from '../../../shared/models/orderParams';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink, CommonModule
  ],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss'
})
export class OrderTableComponent {
  orderColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  orders = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  orderParams = new OrderParams();
  ordersCount = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  private snack = inject(SnackbarService);


  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.orders.data = response.data;
          this.ordersCount = response.count;
        }
      }
    })
  }
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Pending',
      'PaymentReceived': 'Payment Received',
      'PaymentFailed': 'Payment Failed',
      'PaymentMismatch': 'Payment Mismatch',
      'Refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }




  onOrderPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }


  onOrderFilterSelect(event: MatSelectChange) {
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  async openRefundOrderDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    )

    if (confirmed) this.refundOrder(id);
  }


  async opendeleteOrderDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove Order'
    )

    if (confirmed) this.deleteOrder(id);
  }



  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.orders.data = this.orders.data.map(o => o.id === id ? order : o)
      },
    })
  }


  deleteOrder(id: number) {
    this.adminService.deleteOrder(id).subscribe({
      next: () => this.loadOrders(),
    });
  }

}
