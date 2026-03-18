import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/products/products.component').then(m => m.ProductsComponent) },
      { path: 'suppliers', loadComponent: () => import('./features/admin/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
      { path: 'purchases', loadComponent: () => import('./features/admin/purchases/purchases.component').then(m => m.PurchasesComponent) },
      { path: 'bills', loadComponent: () => import('./features/admin/bills/admin-bills.component').then(m => m.AdminBillsComponent) },
      { path: 'portfolio', loadComponent: () => import('./features/admin/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
      { path: 'tax', loadComponent: () => import('./features/admin/tax/tax.component').then(m => m.TaxComponent) },
      { path: 'shop', loadComponent: () => import('./features/admin/shop/shop.component').then(m => m.ShopComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'billing', loadComponent: () => import('./features/user/billing/billing.component').then(m => m.BillingComponent) },
      { path: 'bills', loadComponent: () => import('./features/user/bills/user-bills.component').then(m => m.UserBillsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/auth/login' }
];
