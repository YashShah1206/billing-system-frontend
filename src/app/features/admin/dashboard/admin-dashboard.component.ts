import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ProductService } from '../../../core/services/product.service';
import { BillService } from '../../../core/services/bill.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
          <span class="date">{{ today | date:'EEEE, dd MMMM yyyy' }}</span>
        </div>
        <div class="stat-cards">
          <div class="stat-card blue">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <div class="stat-value">{{ stockSummary?.totalProducts || 0 }}</div>
              <div class="stat-label">Total Products</div>
            </div>
          </div>
          <div class="stat-card red">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <div class="stat-value">{{ stockSummary?.lowStockCount || 0 }}</div>
              <div class="stat-label">Low Stock Alerts</div>
            </div>
          </div>
          <div class="stat-card orange">
            <div class="stat-icon">🚫</div>
            <div class="stat-info">
              <div class="stat-value">{{ stockSummary?.outOfStockCount || 0 }}</div>
              <div class="stat-label">Out of Stock</div>
            </div>
          </div>
          <div class="stat-card green">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <div class="stat-value">₹{{ (stockSummary?.totalInventoryValue || 0) | number:'1.0-0' }}</div>
              <div class="stat-label">Inventory Value</div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-grid">
            <a routerLink="/admin/users" class="action-card">
              <span class="action-icon">👥</span>
              <span class="action-title">Manage Users</span>
              <span class="action-desc">Approve/reject registrations</span>
            </a>
            <a routerLink="/admin/products" class="action-card">
              <span class="action-icon">📦</span>
              <span class="action-title">Add Product</span>
              <span class="action-desc">Add new products to inventory</span>
            </a>
            <a routerLink="/admin/purchases" class="action-card">
              <span class="action-icon">🛒</span>
              <span class="action-title">Purchase Order</span>
              <span class="action-desc">Record stock purchases</span>
            </a>
            <a routerLink="/admin/bills" class="action-card">
              <span class="action-icon">🧾</span>
              <span class="action-title">All Bills</span>
              <span class="action-desc">View and download invoices</span>
            </a>
            <a routerLink="/admin/portfolio" class="action-card">
              <span class="action-icon">📈</span>
              <span class="action-title">Portfolio</span>
              <span class="action-desc">Sales & profit analytics</span>
            </a>
            <a routerLink="/admin/tax" class="action-card">
              <span class="action-icon">🏛️</span>
              <span class="action-title">Tax Reports</span>
              <span class="action-desc">GST & income tax reports</span>
            </a>
            <a routerLink="/admin/suppliers" class="action-card">
              <span class="action-icon">🏭</span>
              <span class="action-title">Suppliers</span>
              <span class="action-desc">Manage vendor list</span>
            </a>
            <a routerLink="/admin/shop" class="action-card">
              <span class="action-icon">🏪</span>
              <span class="action-title">Shop Settings</span>
              <span class="action-desc">Update shop information</span>
            </a>
          </div>
        </div>

        <div class="low-stock-table" *ngIf="stockSummary?.lowStockProducts?.length">
          <h2>⚠️ Low Stock Alerts</h2>
          <table>
            <thead><tr><th>Product</th><th>Code</th><th>Current Stock</th><th>Min Alert</th><th>Action</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of stockSummary.lowStockProducts" [class.out-of-stock]="p.currentStock===0">
                <td><strong>{{ p.productName }}</strong></td>
                <td><code>{{ p.productCode }}</code></td>
                <td><span class="stock-badge" [class.zero]="p.currentStock===0">{{ p.currentStock }} {{ p.unit }}</span></td>
                <td>{{ p.minStockAlert }}</td>
                <td><a routerLink="/admin/purchases" class="btn-sm">Add Stock</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { display:flex; height:100vh; overflow:hidden; background:#f5f6fa; }
    .main { flex:1; overflow-y:auto; padding:28px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
    .page-header h1 { font-size:26px; font-weight:800; color:#1a237e; margin:0; }
    .date { color:#666; font-size:14px; }
    .stat-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:32px; }
    .stat-card { background:#fff; border-radius:16px; padding:24px; display:flex; align-items:center; gap:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    .stat-icon { font-size:36px; }
    .stat-value { font-size:28px; font-weight:800; }
    .stat-label { font-size:13px; color:#666; margin-top:2px; }
    .stat-card.blue .stat-value { color:#1a237e; }
    .stat-card.red .stat-value { color:#c62828; }
    .stat-card.orange .stat-value { color:#e65100; }
    .stat-card.green .stat-value { color:#2e7d32; }
    .quick-actions h2, .low-stock-table h2 { font-size:18px; font-weight:700; color:#333; margin:0 0 16px; }
    .action-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
    .action-card { background:#fff; border-radius:14px; padding:20px; display:flex; flex-direction:column; gap:6px; text-decoration:none; box-shadow:0 2px 10px rgba(0,0,0,0.06); transition:transform 0.2s,box-shadow 0.2s; border:2px solid transparent; }
    .action-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,0.12); border-color:#3f51b5; }
    .action-icon { font-size:28px; }
    .action-title { font-weight:700; color:#1a237e; font-size:15px; }
    .action-desc { font-size:12px; color:#888; }
    .low-stock-table { background:#fff; border-radius:16px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    table { width:100%; border-collapse:collapse; }
    th { background:#f5f6fa; padding:10px 14px; text-align:left; font-size:12px; font-weight:700; color:#555; text-transform:uppercase; }
    td { padding:12px 14px; border-bottom:1px solid #f0f0f0; font-size:14px; }
    tr:last-child td { border-bottom:none; }
    tr.out-of-stock { background:#fff5f5; }
    .stock-badge { background:#fff3e0; color:#e65100; padding:3px 10px; border-radius:12px; font-weight:700; font-size:13px; }
    .stock-badge.zero { background:#ffebee; color:#c62828; }
    .btn-sm { background:#3f51b5; color:#fff; padding:5px 12px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:600; }
    code { background:#e8eaf6; color:#3f51b5; padding:2px 8px; border-radius:4px; font-size:12px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stockSummary: any = null;
  today = new Date();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getStockSummary().subscribe(res => {
      if (res.success) this.stockSummary = res.data;
    });
  }
}
