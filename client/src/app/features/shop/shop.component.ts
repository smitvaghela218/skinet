import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu, //sort
    MatSelectionList, //sort
    MatListOption, //sort
    MatMenuTrigger, //sort
    FormsModule, //ng module for binding
    MatPaginator,
    EmptyStateComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ]

  shopParams = new ShopParams()
  pageSizeOptions = [5, 10, 15, 20]
  // constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.initialiseShop()
  }

  initialiseShop() {
    this.shopService.getBrands()
    this.shopService.getTypes()
    this.getProducts()
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error),
    })
  }
  onSearchChange() {
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    // console.log(event);
    this.shopParams.pageIndex = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    // console.log(selectedOption);

    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageIndex = 1;
      this.getProducts();
    }
  }

  resetFilters() {
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });

    dialogRef.afterClosed().subscribe(
      {
        next: result => {
          if (result) {
            // console.log(result);
            this.shopParams.brands = result.selectedBrands
            this.shopParams.types = result.selectedTypes
            //apply filters
            this.shopParams.pageIndex = 1
            this.getProducts()
          }
        }
      }
    )
  }

}
