import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '../../../shared/models/user';
import { AdminService } from '../../../core/services/admin.service';
import { DialogService } from '../../../core/services/dialog.service';
import { UserParams } from '../../../shared/models/userParams';
import { SnackbarService } from '../../../core/services/snackbar.service';
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
  selector: 'app-user-table',
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
<div
    class="flex flex-wrap items-center justify-between max-w-screen-2xl mx-auto bg-gradient-to-r from-white to-gray-100 p-4 rounded-lg shadow-md border border-gray-200">
    <!-- Left Side: Title with Icon -->
    <div class="flex items-center gap-2">
        <mat-icon class="text-blue-600">people</mat-icon>
        <h2 class="text-2xl font-semibold text-gray-800">Skinet Users</h2>
    </div>

    <!-- Right Side: Buttons & Filter -->
    <div class="flex flex-wrap items-center gap-4">
        <!-- Add User Button -->
        <button routerLink="/admin/user"
            class="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all">
            + Add User
        </button>

        <!-- Filter by Role -->
        <!-- <mat-form-field appearance="outline" class="w-56 h-12">
            <mat-label>Filter by Role</mat-label>
            <mat-select (selectionChange)="onUserFilterSelect($event)">
                @for (role of rolesOptions; track $index) {
                <mat-option [value]="role">{{ role }}</mat-option>
                }
            </mat-select>
        </mat-form-field> -->
    </div>
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
export class UserTableComponent implements OnInit {
  router = inject(Router);
  rowData: User[] = []
  columnDefs: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'email' },
    { field: 'roles' },
    {
      headerName: 'Delete',
      floatingFilter: false,
      filter: false,
      cellRenderer: DeleteButtonRendererComponent,
      cellRendererParams: {
        openDeleteDialog: this.opendeleteUserDialog.bind(this),
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



  rolesOptions = ['All', 'Admin', 'Customer'];
  userColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roles', 'action'];
  users = new MatTableDataSource<User>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  userParams = new UserParams();
  usersCount = 0;
  private snack = inject(SnackbarService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers(this.userParams).subscribe({
      next: response => {
        if (response) {
          // this.users.data = response.data;
          this.rowData = response;
          // this.usersCount = response.count;
        }
      }
    })
  }

  onUserPageChange(event: PageEvent) {
    this.userParams.pageNumber = event.pageIndex + 1;
    this.userParams.pageSize = event.pageSize;
    this.loadUsers();
  }

  onUserFilterSelect(event: MatSelectChange) {
    this.userParams.role = event.value;
    this.userParams.pageNumber = 1;
    this.loadUsers();
  }

  async opendeleteUserDialog(id: string) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete',
      'Are you sure you want to remove User'
    )

    if (confirmed) this.deleteUser(id);
  }

  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
    });
  }

  navigateToEditPage(id: string) {
    this.router.navigate(['/admin/user', id]);
  }

}