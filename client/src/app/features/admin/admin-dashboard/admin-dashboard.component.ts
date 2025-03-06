import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardData } from '../../../shared/models/dashboardData';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  dashboardData?: DashboardData;
  ngOnInit(): void {
    this.initialiseDashboard();
  }

  initialiseDashboard() {
    this.adminService.dashboard().subscribe({
      next: response => {
        if (response) {
          this.dashboardData = response;
          // console.log(this.dashboardData);
        }
      }
    })



  }
}
