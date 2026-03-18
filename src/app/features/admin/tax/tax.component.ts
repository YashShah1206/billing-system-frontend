import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { TaxService } from '../../../core/services/tax.service';
import { TaxReport, IncomeTaxSummary } from '../../../core/models/models';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header"><h1>🏛️ Tax Reports</h1></div>

        <div class="report-tabs">
          <button [class.active]="activeTab==='gst'" (click)="activeTab='gst'">GST Report (GSTR-1 / GSTR-3B)</button>
          <button [class.active]="activeTab==='income'" (click)="activeTab='income'">Income Tax Summary</button>
        </div>

        <!-- GST Tab -->
        <div *ngIf="activeTab==='gst'">
          <div class="filter-card">
            <div class="filter-row">
              <div class="form-group">
                <label>Report Type</label>
                <select [(ngModel)]="gstReq.reportType">
                  <option [value]="1">GSTR-1 (Sales)</option>
                  <option [value]="2">GSTR-3B (Summary)</option>
                  <option [value]="4">Purchase Summary</option>
                  <option [value]="5">Sales Summary</option>
                </select>
              </div>
              <div class="form-group">
                <label>From Date</label>
                <input type="date" [(ngModel)]="gstReq.fromDate">
              </div>
              <div class="form-group">
                <label>To Date</label>
                <input type="date" [(ngModel)]="gstReq.toDate">
              </div>
              <div class="form-actions">
                <button class="btn-primary" (click)="loadGstReport()">📊 View Report</button>
                <button class="btn-export" (click)="exportGstReport()">📥 Export Excel</button>
              </div>
            </div>
          </div>

          <div *ngIf="gstReport">
            <div class="report-header">
              <h2>{{ gstReport.shopName }}</h2>
              <div class="report-meta">
                <span>GSTIN: {{ gstReport.gstNumber }}</span>
                <span>PAN: {{ gstReport.panNumber }}</span>
                <span>Period: {{ gstReport.period }}</span>
              </div>
            </div>

            <!-- Summary Cards -->
            <div class="summary-grid">
              <div class="summary-card output">
                <h3>Output Tax (Sales)</h3>
                <div class="tax-rows">
                  <div class="tax-row"><span>Taxable Sales</span><strong>₹{{ gstReport.totalTaxableSales | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>CGST</span><strong>₹{{ gstReport.totalCgstCollected | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>SGST</span><strong>₹{{ gstReport.totalSgstCollected | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>IGST</span><strong>₹{{ gstReport.totalIgstCollected | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>Cess</span><strong>₹{{ gstReport.totalCessCollected | number:'1.2-2' }}</strong></div>
                  <div class="tax-row total"><span>Total Output</span><strong>₹{{ gstReport.totalOutputTax | number:'1.2-2' }}</strong></div>
                </div>
              </div>
              <div class="summary-card input">
                <h3>Input Tax Credit (Purchases)</h3>
                <div class="tax-rows">
                  <div class="tax-row"><span>Taxable Purchases</span><strong>₹{{ gstReport.totalTaxablePurchases | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>CGST Credit</span><strong>₹{{ gstReport.totalInputCgst | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>SGST Credit</span><strong>₹{{ gstReport.totalInputSgst | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>IGST Credit</span><strong>₹{{ gstReport.totalInputIgst | number:'1.2-2' }}</strong></div>
                  <div class="tax-row"><span>Cess Credit</span><strong>₹{{ gstReport.totalInputCess | number:'1.2-2' }}</strong></div>
                  <div class="tax-row total"><span>Total Input</span><strong>₹{{ gstReport.totalInputTax | number:'1.2-2' }}</strong></div>
                </div>
              </div>
              <div class="summary-card net" [class.payable]="gstReport.netTaxPayable>0" [class.credit]="gstReport.netTaxPayable<=0">
                <h3>Net Tax {{ gstReport.netTaxPayable >= 0 ? 'Payable' : 'Credit' }}</h3>
                <div class="net-amount">₹{{ (gstReport.netTaxPayable | number:'1.2-2') }}</div>
              </div>
            </div>

            <!-- Rate-wise Table -->
            <div class="section-card" *ngIf="gstReport.rateWiseSummary?.length">
              <h3>GST Rate-wise Summary</h3>
              <table><thead><tr><th>GST Rate</th><th>Taxable Amt</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th><th>Total Tax</th></tr></thead>
                <tbody>
                  <tr *ngFor="let r of gstReport.rateWiseSummary">
                    <td><strong>{{ r.gstRate }}%</strong></td>
                    <td>₹{{ r.taxableAmount | number:'1.2-2' }}</td>
                    <td>₹{{ r.cgstAmount | number:'1.2-2' }}</td>
                    <td>₹{{ r.sgstAmount | number:'1.2-2' }}</td>
                    <td>₹{{ r.igstAmount | number:'1.2-2' }}</td>
                    <td>₹{{ r.cessAmount | number:'1.2-2' }}</td>
                    <td><strong>₹{{ r.totalTax | number:'1.2-2' }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Sales Line Items -->
            <div class="section-card">
              <h3>Sales Invoice Details</h3>
              <div class="table-scroll">
                <table><thead><tr><th>Invoice No</th><th>Date</th><th>Customer</th><th>GSTIN</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th></tr></thead>
                  <tbody>
                    <tr *ngFor="let s of gstReport.salesLineItems">
                      <td><strong>{{ s.billNumber }}</strong></td>
                      <td>{{ s.billDate | date:'dd MMM yyyy' }}</td>
                      <td>{{ s.customerName }}</td>
                      <td>{{ s.customerGstin || '-' }}</td>
                      <td>₹{{ s.taxableAmount | number:'1.2-2' }}</td>
                      <td>₹{{ s.cgstAmount | number:'1.2-2' }}</td>
                      <td>₹{{ s.sgstAmount | number:'1.2-2' }}</td>
                      <td>₹{{ s.igstAmount | number:'1.2-2' }}</td>
                      <td><strong>₹{{ s.invoiceValue | number:'1.2-2' }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Income Tax Tab -->
        <div *ngIf="activeTab==='income'">
          <div class="filter-card">
            <div class="filter-row">
              <div class="form-group">
                <label>Financial Year</label>
                <select [(ngModel)]="incomeFY">
                  <option *ngFor="let y of fyYears" [value]="y">FY {{ y }}-{{ (y+1)%100 | number:'2.0' }}</option>
                </select>
              </div>
              <div class="form-actions">
                <button class="btn-primary" (click)="loadIncomeTax()">📊 View Report</button>
              </div>
            </div>
          </div>

          <div *ngIf="incomeTax">
            <div class="kpi-row">
              <div class="kpi"><div class="kpi-l">Total Revenue</div><div class="kpi-v green">₹{{ incomeTax.totalRevenue | number:'1.0-0' }}</div></div>
              <div class="kpi"><div class="kpi-l">Total Purchases</div><div class="kpi-v blue">₹{{ incomeTax.totalPurchases | number:'1.0-0' }}</div></div>
              <div class="kpi"><div class="kpi-l">Gross Profit</div><div class="kpi-v orange">₹{{ incomeTax.grossProfit | number:'1.0-0' }}</div></div>
              <div class="kpi"><div class="kpi-l">Net Profit (Before Tax)</div><div class="kpi-v purple">₹{{ incomeTax.netProfitBeforeTax | number:'1.0-0' }}</div></div>
            </div>
            <div class="section-card">
              <h3>Monthly Breakdown (FY {{ incomeFY }}-{{ (incomeFY+1)%100 | number:'2.0' }})</h3>
              <table><thead><tr><th>Month</th><th>Revenue</th><th>Purchases</th><th>Profit/Loss</th></tr></thead>
                <tbody>
                  <tr *ngFor="let m of incomeTax.monthlySummary">
                    <td><strong>{{ m.monthName }}</strong></td>
                    <td>₹{{ m.revenue | number:'1.0-0' }}</td>
                    <td>₹{{ m.purchases | number:'1.0-0' }}</td>
                    <td [class.profit]="m.profit>=0" [class.loss]="m.profit<0">₹{{ m.profit | number:'1.0-0' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .page-header{margin-bottom:20px} .page-header h1{font-size:24px;font-weight:800;color:#1a237e;margin:0}
    .report-tabs{display:flex;gap:8px;margin-bottom:20px}
    .report-tabs button{padding:10px 20px;border:2px solid #e0e0e0;background:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s}
    .report-tabs button.active{background:#1a237e;border-color:#1a237e;color:#fff}
    .filter-card{background:#fff;border-radius:14px;padding:20px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .filter-row{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-group label{font-size:13px;font-weight:600;color:#555}
    .form-group input,.form-group select{padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px}
    .form-actions{display:flex;gap:10px;padding-bottom:2px}
    .btn-primary{background:#1a237e;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:700}
    .btn-export{background:#e8f5e9;color:#2e7d32;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:700}
    .report-header{background:#1a237e;color:#fff;border-radius:14px;padding:20px;margin-bottom:20px}
    .report-header h2{margin:0 0 8px;font-size:20px}
    .report-meta{display:flex;gap:20px;font-size:13px;opacity:0.8}
    .summary-grid{display:grid;grid-template-columns:1fr 1fr 280px;gap:16px;margin-bottom:20px}
    .summary-card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .summary-card h3{font-size:14px;font-weight:700;margin:0 0 12px;color:#333}
    .tax-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f5f5f5;font-size:13px}
    .tax-row.total{font-weight:700;border-top:2px solid #333;border-bottom:none;margin-top:4px;padding-top:8px}
    .net{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
    .net h3{font-size:14px;font-weight:700;margin:0 0 12px}
    .net.payable{border:2px solid #c62828}
    .net.credit{border:2px solid #2e7d32}
    .net-amount{font-size:32px;font-weight:800}
    .net.payable .net-amount{color:#c62828}
    .net.credit .net-amount{color:#2e7d32}
    .section-card{background:#fff;border-radius:14px;padding:20px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .section-card h3{font-size:15px;font-weight:700;color:#1a237e;margin:0 0 14px}
    table{width:100%;border-collapse:collapse}
    th{background:#f5f6fa;padding:10px 14px;text-align:left;font-size:12px;color:#555;text-transform:uppercase;font-weight:700}
    td{padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:13px}
    .table-scroll{overflow-x:auto}
    .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}
    .kpi{background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .kpi-l{font-size:13px;color:#666;margin-bottom:8px}
    .kpi-v{font-size:24px;font-weight:800}
    .kpi-v.green{color:#2e7d32}.kpi-v.blue{color:#1565c0}.kpi-v.orange{color:#e65100}.kpi-v.purple{color:#6a1b9a}
    .profit{color:#2e7d32;font-weight:600} .loss{color:#c62828;font-weight:600}
  `]
})
export class TaxComponent implements OnInit {
  activeTab = 'gst';
  gstReport: TaxReport | null = null;
  incomeTax: IncomeTaxSummary | null = null;
  gstReq: any = { reportType: 1, fromDate: this.firstOfMonth(), toDate: this.today() };
  incomeFY = new Date().getFullYear();
  fyYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(private taxService: TaxService) {}
  ngOnInit() {}

  loadGstReport() {
    this.taxService.getTaxReport(this.gstReq).subscribe(res => { if (res.success) this.gstReport = res.data; });
  }

  exportGstReport() {
    this.taxService.exportTaxReport(this.gstReq).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `TaxReport.xlsx`; a.click();
      URL.revokeObjectURL(url);
    });
  }

  loadIncomeTax() {
    this.taxService.getIncomeTax(this.incomeFY).subscribe(res => { if (res.success) this.incomeTax = res.data; });
  }

  firstOfMonth() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; }
  today() { return new Date().toISOString().split('T')[0]; }
}
