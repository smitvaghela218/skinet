import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../core/services/dialog.service';
import { ProductParams } from '../../shared/models/productParams';
import { Product } from '../../shared/models/product';
import { User } from '../../shared/models/user';
import { UserParams } from '../../shared/models/userParams';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-admin',
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
    RouterLink
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  orderColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  productColumns: string[] = ['id', 'name', 'type', 'brand', 'price', 'action'];
  userColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roles', 'action'];
  orders = new MatTableDataSource<Order>([]);
  products = new MatTableDataSource<Product>([]);
  users = new MatTableDataSource<User>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  orderParams = new OrderParams();
  productParams = new ProductParams();
  userParams = new UserParams();
  ordersCount = 0;
  productsCount = 0;
  usersCount = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  rolesOptions = ['All', 'Admin', 'Customer'];
  private snack = inject(SnackbarService);


  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
    this.loadUsers();
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

  loadProducts() {
    this.adminService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products.data = response.data;
          this.productsCount = response.count;
        }
      }
    })
  }

  loadUsers() {
    this.adminService.getUsers(this.userParams).subscribe({
      next: response => {
        // if (response.data) {
        //   this.users.data = response.data;
        //   this.usersCount = response.count;
        // }
      }
    })
  }

  onUserPageChange(event: PageEvent) {
    this.userParams.pageNumber = event.pageIndex + 1;
    this.userParams.pageSize = event.pageSize;
    this.loadUsers();
  }
  onProductPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }
  onOrderPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onUserFilterSelect(event: MatSelectChange) {
    this.userParams.role = event.value;
    this.userParams.pageNumber = 1;
    this.loadUsers();
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

  async opendeleteProductDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove product'
    )

    if (confirmed) this.deleteProduct(id);
  }

  async opendeleteOrderDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove Order'
    )

    if (confirmed) this.deleteOrder(id);
  }

  async opendeleteUserDialog(id: string) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove User'
    )

    if (confirmed) this.deleteUser(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.orders.data = this.orders.data.map(o => o.id === id ? order : o)
      },
    })
  }

  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
    });
  }

  deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
    });
  }

  deleteOrder(id: number) {
    this.adminService.deleteOrder(id).subscribe({
      next: () => this.loadOrders(),
    });
  }

}