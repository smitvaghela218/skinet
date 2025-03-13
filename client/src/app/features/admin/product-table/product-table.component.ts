import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../../shared/models/product';
import { AdminService } from '../../../core/services/admin.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ProductParams } from '../../../shared/models/productParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { DeleteButtonRendererComponent } from '../delete-button-renderer/delete-button-renderer.component';
import { Router } from '@angular/router';
import { EditButtonRendererComponent } from '../edit-button-renderer/edit-button-renderer.component';

// Register ag-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);


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
    RouterLink,
    AgGridAngular
  ],
  template: `
  <!-- HEADER SECTION -->
<!-- HEADER SECTION -->
<div class="flex items-center justify-between max-w-screen-2xl mx-auto bg-white p-4 rounded-lg shadow-md border">

    <!-- Left Side: Title -->
    <h2 class="text-2xl font-semibold text-gray-800">Skinet Products</h2>

    <!-- Right Side: Add Product Button -->
    <button routerLink="/admin/product"
        class="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md shadow hover:bg-blue-700 transition">
        + Add Product
    </button>
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
export class ProductTableComponent implements OnInit {

  router = inject(Router);
  rowData: Product[] = []
  columnDefs: ColDef[] = [
    { field: 'id', filter: 'agNumberColumnFilter' },
    { field: 'name' },
    { field: 'type' },
    { field: 'brand' },
    { field: 'price', filter: 'agNumberColumnFilter' },
    {
      headerName: 'Delete',
      floatingFilter: false,
      filter: false,
      cellRenderer: DeleteButtonRendererComponent,
      cellRendererParams: {
        openDeleteDialog: this.opendeleteProductDialog.bind(this),
      },
      flex: 0, // Make sure the flex does not grow the column
      minWidth: 50, // Set a minimum width that fits the button size
      maxWidth: 80, // Set a maximum width if needed
    },
    {
      headerName: 'Edit',
      floatingFilter: false,
      filter: false,
      cellRenderer: EditButtonRendererComponent,
      cellRendererParams: {
        navigateToEditPage: this.navigateToEditPage.bind(this),
      },
      flex: 0, // Make sure the flex does not grow the column
      minWidth: 50, // Set a minimum width that fits the button size
      maxWidth: 70, // Set a maximum width if needed
    },

  ]

  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 15, 20];







  productColumns: string[] = ['id', 'name', 'type', 'brand', 'price', 'action'];
  products = new MatTableDataSource<Product>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  productParams = new ProductParams();
  productsCount = 0;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: response => {
        if (response) {
          // this.products.data = response.data;
          this.rowData = response;
          // this.productsCount = response.count;
        }
      }
    })
  }
  onProductPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  } async opendeleteProductDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove product'
    )

    if (confirmed) this.deleteProduct(id);
  }

  deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
    });
  }

  navigateToEditPage(id: string) {
    this.router.navigate(['/admin/product', id]);
  }

}
