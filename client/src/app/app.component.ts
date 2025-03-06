import { Component, inject } from '@angular/core';
import { HeaderComponent } from "./layout/header/header.component";
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { IsAdminSidebarVisibleDirective } from './shared/directives/is-admin-sidebar-visible.directive';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent, IsAdminSidebarVisibleDirective, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'Skinet';
  sidebarService = inject(SidebarService);
  isSidebarVisible: boolean = false;

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.checkSidebarVisibility();
    });
  }

  checkSidebarVisibility() {
    // Show sidebar only if the route starts with "/admin"
    this.isSidebarVisible = this.router.url.startsWith('/admin');
    console.log(" this.isSidebarVisible " + this.isSidebarVisible);

  }

}