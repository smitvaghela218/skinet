import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { emptyCartGuard } from './core/guards/empty-cart.guard';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { OrderComponent } from './features/orders/order.component';
import { OrderDetailedComponent } from './features/orders/order-detailed/order-detailed.component';
import { orderCompleteGuard } from './core/guards/order-complete.guard';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { AddProductComponent } from './features/admin/add-product/add-product.component';
import { EditProductComponent } from './features/admin/edit-product/edit-product.component';
import { AddUserComponent } from './features/admin/add-user/add-user.component';
import { EditUserComponent } from './features/admin/edit-user/edit-user.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ProductTableComponent } from './features/admin/product-table/product-table.component';
import { UserTableComponent } from './features/admin/user-table/user-table.component';
import { OrderTableComponent } from './features/admin/order-table/order-table.component';
import { TestGridComponent } from './test-grid/test-grid.component';
import { UserComponent } from './features/admin/user/user.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard, emptyCartGuard] },
    { path: 'checkout/success', component: CheckoutSuccessComponent, canActivate: [authGuard, orderCompleteGuard] },
    { path: 'orders', component: OrderComponent, canActivate: [authGuard] },
    { path: 'orders/:id', component: OrderDetailedComponent, canActivate: [authGuard] },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'test-error', component: TestErrorComponent },
    // { path: 'test', component: TestGridComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: 'server-error', component: ServerErrorComponent },
    // { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/product-table', component: ProductTableComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/product', component: AddProductComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/product/:id', component: EditProductComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/user-table', component: UserTableComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/user', component: AddUserComponent, canActivate: [authGuard, adminGuard] },
    { path: 'user', component: UserComponent, },
    { path: 'admin/user/:id', component: EditUserComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/order-table', component: OrderTableComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }, // default pathMatch is prefix
];
