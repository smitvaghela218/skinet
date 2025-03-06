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
    RouterLink
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
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
        if (response.data) {
          this.users.data = response.data;
          this.usersCount = response.count;
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
  } deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
    });
  }

}