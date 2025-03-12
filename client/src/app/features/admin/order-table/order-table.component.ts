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

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { DeleteButtonRendererComponent } from '../delete-button-renderer/delete-button-renderer.component';
import { Router } from '@angular/router';
import { EditButtonRendererComponent } from '../edit-button-renderer/edit-button-renderer.component';
import { RefundButtonRendererComponent } from '../refund-button-renderer/refund-button-renderer.component';

// Register ag-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);



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
    RouterLink,
    CommonModule,
    AgGridAngular
  ],
  template: `
  <!-- HEADER SECTION -->
<!-- HEADER SECTION -->
<div
    class="flex items-center justify-between max-w-screen-2xl mx-auto bg-white pt-2 px-2 pb-1 rounded-lg shadow-md border">

    <!-- Left Side: Title -->
    <h2 class="text-2xl font-semibold text-gray-800">Orders</h2>

    <!-- Right Side: Filter Dropdown -->
    <!-- <mat-form-field appearance="outline" class="w-56">
        <mat-label>Filter by status</mat-label>
        <mat-select (selectionChange)="onOrderFilterSelect($event)">
            @for (status of statusOptions; track $index) {
            <mat-option [value]="status">{{ status }}</mat-option>
            }
        </mat-select>
    </mat-form-field> -->

</div>

<br>
  <div style="height: 50vh; display: flex; flex-direction: column;">
    <ag-grid-angular
      #agGrid
      style="flex: 1; width: 100%;"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [pagination]="true"
      [paginationPageSize]="paginationPageSize"
      [paginationPageSizeSelector]="paginationPageSizeSelector"
    ></ag-grid-angular>
  </div>
`,
})
export class OrderTableComponent {

  router = inject(Router);
  rowData: Order[] = []
  columnDefs: ColDef[] = [
    { field: 'id', filter: 'agNumberColumnFilter' },
    { field: 'buyerEmail' },
    { field: 'orderDate', filter: 'agDateColumnFilter' },
    { field: 'total', filter: 'agNumberColumnFilter' },
    { field: 'status' },
    {
      headerName: 'Delete',
      floatingFilter: false,
      filter: false,
      cellRenderer: DeleteButtonRendererComponent,
      cellRendererParams: {
        openDeleteDialog: this.opendeleteOrderDialog.bind(this),
      },
      flex: 0, // Make sure the flex does not grow the column
      minWidth: 50, // Set a minimum width that fits the button size
      maxWidth: 80, // Set a maximum width if needed
    },
    {
      headerName: 'Refund',
      floatingFilter: false,
      filter: false,
      cellRenderer: RefundButtonRendererComponent,
      cellRendererParams: {
        openRefundOrderDialog: this.openRefundOrderDialog.bind(this),
      },
      flex: 0, // Make sure the flex does not grow the column
      minWidth: 50, // Set a minimum width that fits the button size
      maxWidth: 80, // Set a maximum width if needed
    },
    // {
    //   headerName: 'Edit',
    //   floatingFilter: false,
    //   filter: false,
    //   cellRenderer: EditButtonRendererComponent,
    //   cellRendererParams: {
    //     navigateToEditPage: this.navigateToEditPage.bind(this),
    //   },
    //   flex: 0, // Make sure the flex does not grow the column
    //   minWidth: 50, // Set a minimum width that fits the button size
    //   maxWidth: 70, // Set a maximum width if needed
    // },

  ]
  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 15, 20];





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
          this.rowData = response.data;
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
        this.loadOrders()
      },
    })
  }


  deleteOrder(id: number) {
    this.adminService.deleteOrder(id).subscribe({
      next: () => this.loadOrders(),
    });
  }

}
