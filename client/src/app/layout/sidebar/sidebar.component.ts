import { Component, inject, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isDropdownOpen = signal(true);

  // toggleDropdown() {
  //   this.isDropdownOpen.set(true);
  // }
}
