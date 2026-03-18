import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="welcome-banner">
          <div class="welcome-text">
            <h1>Good {{ greeting }}, {{ user?.fullName?.split(' ')[0] }}! 👋</h1>
            <p>{{ today | date:'EEEE, dd MMMM yyyy' }}</p>
          </div>
          <div class="welcome-icon">🧾</div>
        </div>

        <div class="action-cards">
          <a routerLink="/user/billing" class="action-hero">
            <div class="action-hero-icon">➕</div>
            <div class="action-hero-title">Create New Bill</div>
            <div class="action-hero-desc">Click to generate a new invoice for your customer</div>
            <div class="action-hero-arrow">→</div>
          </a>
          <a routerLink="/user/bills" class="action-secondary">
            <div class="action-sec-icon">📋</div>
            <div class="action-sec-title">My Bills</div>
            <div class="action-sec-desc">View and download your created invoices</div>
          </a>
        </div>

        <div class="info-section">
          <div class="info-card">
            <h3>🚀 Quick Tips</h3>
            <ul>
              <li>Select products and quantities to auto-calculate GST (CGST + SGST or IGST)</li>
              <li>Enter customer GSTIN for B2B invoices</li>
              <li>Download or save PDF after bill creation</li>
              <li>Contact admin to add new products to inventory</li>
            </ul>
          </div>
          <div class="info-card">
            <h3>📞 Need Help?</h3>
            <p>Contact your admin for:</p>
            <ul>
              <li>Adding new products to inventory</li>
              <li>Updating selling prices</li>
              <li>Viewing overall reports</li>
              <li>Account-related issues</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .welcome-banner{background:linear-gradient(135deg,#1a237e,#3f51b5);border-radius:20px;padding:32px;color:#fff;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
    .welcome-text h1{margin:0 0 6px;font-size:26px;font-weight:800}
    .welcome-text p{margin:0;opacity:0.8;font-size:14px}
    .welcome-icon{font-size:60px;opacity:0.3}
    .action-cards{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:24px}
    .action-hero{background:linear-gradient(135deg,#ffd740,#ffab00);border-radius:20px;padding:32px;display:flex;flex-direction:column;gap:8px;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden}
    .action-hero:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(255,171,0,0.4)}
    .action-hero-icon{font-size:40px}
    .action-hero-title{font-size:22px;font-weight:800;color:#1a237e}
    .action-hero-desc{font-size:14px;color:#333;opacity:0.8}
    .action-hero-arrow{font-size:28px;color:#1a237e;font-weight:800;position:absolute;right:28px;top:50%;transform:translateY(-50%)}
    .action-secondary{background:#fff;border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:8px;text-decoration:none;box-shadow:0 2px 12px rgba(0,0,0,0.06);transition:transform 0.2s;border:2px solid transparent}
    .action-secondary:hover{transform:translateY(-3px);border-color:#3f51b5}
    .action-sec-icon{font-size:32px}
    .action-sec-title{font-size:18px;font-weight:700;color:#1a237e}
    .action-sec-desc{font-size:13px;color:#666}
    .info-section{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .info-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .info-card h3{font-size:16px;font-weight:700;color:#1a237e;margin:0 0 14px}
    .info-card ul{margin:0;padding-left:20px;color:#555;font-size:14px;line-height:1.8}
    .info-card p{color:#555;font-size:14px;margin:0 0 10px}
  `]
})
export class UserDashboardComponent {
  today = new Date();
  get user() { return JSON.parse(localStorage.getItem('user') || 'null'); }
  get greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  }
}
