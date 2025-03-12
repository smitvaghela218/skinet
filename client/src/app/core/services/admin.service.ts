import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { Order } from '../../shared/models/order';
import { OrderParams } from '../../shared/models/orderParams';
import { ProductParams } from '../../shared/models/productParams';
import { Product } from '../../shared/models/product';
import { UserParams } from '../../shared/models/userParams';
import { User } from '../../shared/models/user';
import { DashboardData } from '../../shared/models/dashboardData';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  // /admin/dashboard

  dashboard() {
    return this.http.get<DashboardData>(this.baseUrl + 'admin/dashboard');
  }

  editUser(id: string | undefined, user: any) {
    return this.http.put(`${this.baseUrl}admin/users/${id}`, user);
  }

  getUser(id: string) {
    return this.http.get<User>(this.baseUrl + 'admin/users/' + id);
  }

  addUser(adminCreateUser: any) {
    return this.http.post(this.baseUrl + 'admin/users', adminCreateUser);
  }

  editProduct(id: number | undefined, formData: FormData) {
    return this.http.put(`${this.baseUrl}products/${id}`, formData);
  }


  addProduct(formData: FormData) {
    console.log(formData);
    return this.http.post(this.baseUrl + 'products', formData);
  }


  getOrders(orderParams: OrderParams) {
    let params = new HttpParams();
    if (orderParams.filter && orderParams.filter !== 'All') {
      params = params.append('status', orderParams.filter);
    }
    params = params.append('pageIndex', orderParams.pageNumber);
    params = params.append('pageSize', orderParams.pageSize);
    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', { params });
  }

  getOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id);
  }

  refundOrder(id: number) {
    return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {});
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }
  deleteOrder(id: number) {
    return this.http.delete(this.baseUrl + 'orders/' + id);
  }
  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + 'admin/users/' + id);
  }
  getProducts(productParams: ProductParams) {
    let params = new HttpParams();
    params = params.append('pageIndex', productParams.pageNumber);
    params = params.append('pageSize', productParams.pageSize);
    // params = params.append('sort', 'name');
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }

  getUsers() {
    // let params = new HttpParams();
    // params = params.append('pageIndex', userParams.pageNumber);
    // params = params.append('pageSize', userParams.pageSize);
    // params = params.append('role', userParams.role);
    return this.http.get<User[]>(this.baseUrl + 'admin/users');
  }
}