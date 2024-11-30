import { Component } from '@angular/core';
import { HeaderComponent } from "./layout/header/header.component";
import { CommonModule } from '@angular/common';
import { ShopComponent } from "./features/shop/shop.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ShopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'Skinet';
}