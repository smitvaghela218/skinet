import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../../shared/models/product';
import { AdminService } from '../../../core/services/admin.service';
import { DialogService } from '../../../core/services/dialog.service';
import { UserParams } from '../../../shared/models/userParams';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ProductParams } from '../../../shared/models/productParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-table',
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
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent implements OnInit {
  productColumns: string[] = ['id', 'name', 'type', 'brand', 'price', 'action'];
  products = new MatTableDataSource<Product>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  productParams = new ProductParams();
  productsCount = 0;
  ngOnInit(): void {
    this.loadProducts();
  } loadProducts() {
    this.adminService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products.data = response.data;
          this.productsCount = response.count;
        }
      }
    })
  } onProductPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  } async opendeleteProductDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove product'
    )

    if (confirmed) this.deleteProduct(id);
  } deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
    });
  }
}
