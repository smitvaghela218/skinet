import { Component, inject, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isDropdownOpen = signal(false);

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }
}
