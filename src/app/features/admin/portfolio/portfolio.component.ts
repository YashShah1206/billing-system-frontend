import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioSummary } from '../../../core/models/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>📈 Portfolio & Analytics</h1>
        </div>

        <!-- Period Selector -->
        <div class="period-bar">
          <div class="period-tabs">
            <button *ngFor="let p of periods" [class.active]="req.period===p.value" (click)="req.period=p.value;load()">{{ p.label }}</button>
          </div>
          <div class="period-extra" *ngIf="req.period===3">
            <select [(ngModel)]="req.month" (change)="load()">
              <option *ngFor="let m of months; let i=index" [value]="i+1">{{ m }}</option>
            </select>
            <select [(ngModel)]="req.year" (change)="load()">
              <option *ngFor="let y of years" [value]="y">{{ y }}</option>
            </select>
          </div>
          <div class="period-extra" *ngIf="req.period===4">
            <select [(ngModel)]="req.quarter" (change)="load()"><option [value]="1">Q1 Apr-Jun</option><option [value]="2">Q2 Jul-Sep</option><option [value]="3">Q3 Oct-Dec</option><option [value]="4">Q4 Jan-Mar</option></select>
            <select [(ngModel)]="req.year" (change)="load()"><option *ngFor="let y of years" [value]="y">{{ y }}</option></select>
          </div>
          <div class="period-extra" *ngIf="req.period===5">
            <select [(ngModel)]="req.year" (change)="load()"><option *ngFor="let y of years" [value]="y">FY {{ y }}-{{ (y+1)%100 | number:'2.0' }}</option></select>
          </div>
          <div class="period-extra" *ngIf="req.period===6">
            <input type="date" [(ngModel)]="req.fromDate" (change)="load()">
            <input type="date" [(ngModel)]="req.toDate" (change)="load()">
          </div>
        </div>

        <div *ngIf="loading" class="loading">Loading analytics...</div>

        <div *ngIf="summary && !loading">
          <div class="period-title">{{ summary.periodLabel }}</div>

          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card green"><div class="kpi-label">Total Sales</div><div class="kpi-value">₹{{ summary.totalSales | number:'1.0-0' }}</div></div>
            <div class="kpi-card blue"><div class="kpi-label">Total Purchases</div><div class="kpi-value">₹{{ summary.totalPurchases | number:'1.0-0' }}</div></div>
            <div class="kpi-card orange"><div class="kpi-label">Gross Profit</div><div class="kpi-value">₹{{ summary.grossProfit | number:'1.0-0' }}</div></div>
            <div class="kpi-card purple"><div class="kpi-label">Profit Margin</div><div class="kpi-value">{{ summary.profitMarginPercent | number:'1.1-1' }}%</div></div>
            <div class="kpi-card teal"><div class="kpi-label">Total Bills</div><div class="kpi-value">{{ summary.totalBills }}</div></div>
            <div class="kpi-card red"><div class="kpi-label">Tax Collected</div><div class="kpi-value">₹{{ summary.totalTaxCollected | number:'1.0-0' }}</div></div>
            <div class="kpi-card navy"><div class="kpi-label">Avg Bill Value</div><div class="kpi-value">₹{{ summary.averageBillValue | number:'1.0-0' }}</div></div>
            <div class="kpi-card gray"><div class="kpi-label">Discount Given</div><div class="kpi-value">₹{{ summary.totalDiscount | number:'1.0-0' }}</div></div>
          </div>

          <!-- Tax Breakdown -->
          <div class="section-card">
            <h2>Tax Breakdown</h2>
            <div class="tax-grid">
              <div class="tax-item"><span>CGST</span><strong>₹{{ summary.totalCgst | number:'1.2-2' }}</strong></div>
              <div class="tax-item"><span>SGST</span><strong>₹{{ summary.totalSgst | number:'1.2-2' }}</strong></div>
              <div class="tax-item"><span>IGST</span><strong>₹{{ summary.totalIgst | number:'1.2-2' }}</strong></div>
              <div class="tax-item"><span>Cess</span><strong>₹{{ summary.totalCess | number:'1.2-2' }}</strong></div>
            </div>
          </div>

          <!-- Top Products -->
          <div class="section-card" *ngIf="summary.topProducts?.length">
            <h2>🏆 Top Products</h2>
            <table class="inner-table">
              <thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th><th>Profit</th></tr></thead>
              <tbody>
                <tr *ngFor="let p of summary.topProducts; let i=index">
                  <td><span class="rank">{{ i+1 }}</span> {{ p.productName }}</td>
                  <td>{{ p.quantitySold }}</td>
                  <td>₹{{ p.revenue | number:'1.2-2' }}</td>
                  <td class="profit">₹{{ p.profit | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Payment Breakdown -->
          <div class="section-card" *ngIf="summary.paymentBreakdown?.length">
            <h2>💳 Payment Mode Breakdown</h2>
            <div class="payment-grid">
              <div class="payment-item" *ngFor="let p of summary.paymentBreakdown">
                <div class="payment-mode">{{ p.paymentMode }}</div>
                <div class="payment-count">{{ p.count }} bills</div>
                <div class="payment-amount">₹{{ p.amount | number:'1.0-0' }}</div>
              </div>
            </div>
          </div>

          <!-- Breakdown Table -->
          <div class="section-card" *ngIf="summary.breakdown?.length">
            <h2>📊 Period Breakdown</h2>
            <table class="inner-table">
              <thead><tr><th>Period</th><th>Sales</th><th>Purchases</th><th>Profit</th><th>Bills</th></tr></thead>
              <tbody>
                <tr *ngFor="let b of summary.breakdown">
                  <td><strong>{{ b.label }}</strong></td>
                  <td>₹{{ b.sales | number:'1.0-0' }}</td>
                  <td>₹{{ b.purchases | number:'1.0-0' }}</td>
                  <td [class.profit]="b.profit>=0" [class.loss]="b.profit<0">₹{{ b.profit | number:'1.0-0' }}</td>
                  <td>{{ b.billCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .page-header{margin-bottom:20px} .page-header h1{font-size:24px;font-weight:800;color:#1a237e;margin:0}
    .period-bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:20px;background:#fff;padding:16px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .period-tabs{display:flex;gap:6px}
    .period-tabs button{padding:8px 16px;border:2px solid #e0e0e0;background:#fff;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s}
    .period-tabs button.active{background:#1a237e;border-color:#1a237e;color:#fff}
    .period-extra{display:flex;gap:8px}
    .period-extra input,.period-extra select{padding:8px 12px;border:2px solid #e0e0e0;border-radius:8px;font-size:13px}
    .period-title{font-size:16px;font-weight:700;color:#3f51b5;margin-bottom:16px}
    .loading{text-align:center;padding:40px;color:#666}
    .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
    .kpi-card{border-radius:14px;padding:20px;color:#fff}
    .kpi-card.green{background:linear-gradient(135deg,#2e7d32,#43a047)}
    .kpi-card.blue{background:linear-gradient(135deg,#1565c0,#1976d2)}
    .kpi-card.orange{background:linear-gradient(135deg,#e65100,#f57c00)}
    .kpi-card.purple{background:linear-gradient(135deg,#6a1b9a,#8e24aa)}
    .kpi-card.teal{background:linear-gradient(135deg,#00695c,#00897b)}
    .kpi-card.red{background:linear-gradient(135deg,#b71c1c,#c62828)}
    .kpi-card.navy{background:linear-gradient(135deg,#1a237e,#283593)}
    .kpi-card.gray{background:linear-gradient(135deg,#546e7a,#607d8b)}
    .kpi-label{font-size:12px;opacity:0.85;margin-bottom:6px}
    .kpi-value{font-size:24px;font-weight:800}
    .section-card{background:#fff;border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .section-card h2{font-size:16px;font-weight:700;color:#1a237e;margin:0 0 16px}
    .tax-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .tax-item{background:#f5f6fa;border-radius:10px;padding:14px;text-align:center}
    .tax-item span{display:block;font-size:12px;color:#666;margin-bottom:4px}
    .tax-item strong{font-size:18px;color:#1a237e}
    .inner-table{width:100%;border-collapse:collapse}
    .inner-table th{background:#f5f6fa;padding:10px 14px;text-align:left;font-size:12px;color:#555;text-transform:uppercase}
    .inner-table td{padding:11px 14px;border-bottom:1px solid #f0f0f0;font-size:14px}
    .rank{display:inline-block;width:22px;height:22px;background:#1a237e;color:#fff;border-radius:50%;font-size:11px;font-weight:700;line-height:22px;text-align:center;margin-right:6px}
    .profit{color:#2e7d32;font-weight:600}
    .loss{color:#c62828;font-weight:600}
    .payment-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .payment-item{background:#f5f6fa;border-radius:10px;padding:14px;text-align:center}
    .payment-mode{font-weight:700;color:#1a237e;margin-bottom:4px}
    .payment-count{font-size:12px;color:#666}
    .payment-amount{font-size:18px;font-weight:700;color:#2e7d32;margin-top:4px}
  `]
})
export class PortfolioComponent implements OnInit {
  summary: PortfolioSummary | null = null;
  loading = false;
  req: any = { period: 3, month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  periods = [
    { label: 'Today', value: 1 }, { label: 'Weekly', value: 2 }, { label: 'Monthly', value: 3 },
    { label: 'Quarterly', value: 4 }, { label: 'Yearly', value: 5 }, { label: 'Custom', value: 6 }
  ];
  months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(private portfolioService: PortfolioService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.portfolioService.getPortfolio(this.req).subscribe(res => {
      this.loading = false;
      if (res.success) this.summary = res.data;
    });
  }
}
