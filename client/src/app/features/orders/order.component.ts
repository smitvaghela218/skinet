import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, CommonModule, EmptyStateComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];
  private router = inject(Router);
  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe(
      {
        next: (orders) => {
          this.orders = orders;
        }
      }
    )
  }
  
  onAction() {
    this.router.navigateByUrl('/shop');
  }

}
