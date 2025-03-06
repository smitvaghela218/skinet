import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isAdminSidebarVisible = signal<boolean>(false);
  toggleSidebar() {
    this.isAdminSidebarVisible.set(!this.isAdminSidebarVisible());
    console.log("this.isAdminSidebarVisible.set(!this.isAdminSidebarVisible()) " + (this.isAdminSidebarVisible));
  }

  getSidebarState() {
    return this.isAdminSidebarVisible;
    console.log("return this.isAdminSidebarVisible; " + this.isAdminSidebarVisible);

  }
}
