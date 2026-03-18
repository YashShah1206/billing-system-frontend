import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <span class="logo-icon">🧾</span>
        <span class="logo-text" *ngIf="!collapsed">BillPro</span>
        <button class="toggle-btn" (click)="collapsed=!collapsed">{{ collapsed ? '▶' : '◀' }}</button>
      </div>
      <div class="user-info" *ngIf="!collapsed">
        <div class="avatar">{{ user?.fullName?.charAt(0) }}</div>
        <div>
          <div class="user-name">{{ user?.fullName }}</div>
          <div class="user-role">{{ user?.role }}</div>
        </div>
      </div>
      <ul class="nav-links">
        <ng-container *ngIf="isAdmin">
          <li class="nav-section" *ngIf="!collapsed">MAIN</li>
          <li><a routerLink="/admin/dashboard" routerLinkActive="active"><span class="icon">📊</span><span *ngIf="!collapsed">Dashboard</span></a></li>
          <li><a routerLink="/admin/users" routerLinkActive="active"><span class="icon">👥</span><span *ngIf="!collapsed">User Management</span></a></li>
          <li class="nav-section" *ngIf="!collapsed">INVENTORY</li>
          <li><a routerLink="/admin/products" routerLinkActive="active"><span class="icon">📦</span><span *ngIf="!collapsed">Products</span></a></li>
          <li><a routerLink="/admin/suppliers" routerLinkActive="active"><span class="icon">🏭</span><span *ngIf="!collapsed">Suppliers</span></a></li>
          <li><a routerLink="/admin/purchases" routerLinkActive="active"><span class="icon">🛒</span><span *ngIf="!collapsed">Purchase Orders</span></a></li>
          <li class="nav-section" *ngIf="!collapsed">BILLING</li>
          <li><a routerLink="/admin/bills" routerLinkActive="active"><span class="icon">🧾</span><span *ngIf="!collapsed">All Bills</span></a></li>
          <li class="nav-section" *ngIf="!collapsed">REPORTS</li>
          <li><a routerLink="/admin/portfolio" routerLinkActive="active"><span class="icon">📈</span><span *ngIf="!collapsed">Portfolio</span></a></li>
          <li><a routerLink="/admin/tax" routerLinkActive="active"><span class="icon">🏛️</span><span *ngIf="!collapsed">Tax Reports</span></a></li>
          <li class="nav-section" *ngIf="!collapsed">SETTINGS</li>
          <li><a routerLink="/admin/shop" routerLinkActive="active"><span class="icon">🏪</span><span *ngIf="!collapsed">Shop Settings</span></a></li>
        </ng-container>
        <ng-container *ngIf="!isAdmin">
          <li class="nav-section" *ngIf="!collapsed">MENU</li>
          <li><a routerLink="/user/dashboard" routerLinkActive="active"><span class="icon">🏠</span><span *ngIf="!collapsed">Dashboard</span></a></li>
          <li><a routerLink="/user/billing" routerLinkActive="active"><span class="icon">➕</span><span *ngIf="!collapsed">Create Bill</span></a></li>
          <li><a routerLink="/user/bills" routerLinkActive="active"><span class="icon">📋</span><span *ngIf="!collapsed">My Bills</span></a></li>
        </ng-container>
      </ul>
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <span class="icon">🚪</span><span *ngIf="!collapsed">Logout</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar { width:260px; background:linear-gradient(180deg,#1a237e 0%,#283593 100%); color:#fff; height:100vh; display:flex; flex-direction:column; transition:width 0.3s; overflow:hidden; flex-shrink:0; }
    .sidebar.collapsed { width:64px; }
    .sidebar-header { display:flex; align-items:center; padding:20px 16px; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); }
    .logo-icon { font-size:24px; flex-shrink:0; }
    .logo-text { font-size:20px; font-weight:800; flex:1; }
    .toggle-btn { background:none; border:none; color:#fff; cursor:pointer; font-size:12px; margin-left:auto; }
    .user-info { display:flex; align-items:center; gap:10px; padding:16px; border-bottom:1px solid rgba(255,255,255,0.1); }
    .avatar { width:38px; height:38px; background:#ffd740; color:#1a237e; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; flex-shrink:0; }
    .user-name { font-weight:600; font-size:13px; }
    .user-role { font-size:11px; color:#b3c5f9; background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:12px; display:inline-block; }
    .nav-links { list-style:none; padding:8px 0; margin:0; flex:1; overflow-y:auto; }
    .nav-links a { display:flex; align-items:center; gap:12px; padding:11px 16px; color:rgba(255,255,255,0.75); text-decoration:none; transition:all 0.2s; font-size:14px; }
    .nav-links a:hover, .nav-links a.active { background:rgba(255,255,255,0.15); color:#fff; border-right:3px solid #ffd740; }
    .nav-section { font-size:10px; font-weight:700; letter-spacing:1.5px; color:rgba(255,255,255,0.4); padding:12px 16px 4px; text-transform:uppercase; }
    .icon { font-size:18px; flex-shrink:0; width:20px; text-align:center; }
    .sidebar-footer { padding:12px 8px; border-top:1px solid rgba(255,255,255,0.1); }
    .logout-btn { width:100%; display:flex; align-items:center; gap:12px; padding:11px 16px; background:none; border:none; color:rgba(255,255,255,0.7); cursor:pointer; font-size:14px; border-radius:8px; transition:background 0.2s; }
    .logout-btn:hover { background:rgba(255,50,50,0.2); color:#ff5252; }
  `]
})
export class SidebarComponent {
  collapsed = false;
  get user() { return this.auth.getCurrentUser(); }
  get isAdmin() { return this.auth.isAdmin(); }
  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); }
}
