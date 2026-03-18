import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { BillService } from '../../../core/services/bill.service';
import { BillListItem, BillFilter } from '../../../core/models/models';

@Component({
  selector: 'app-admin-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>🧾 All Bills</h1>
          <div class="summary-chips">
            <span class="chip">Total: {{ pagedResult?.totalCount || 0 }}</span>
          </div>
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <input type="date" [(ngModel)]="filter.fromDate" placeholder="From Date">
          <input type="date" [(ngModel)]="filter.toDate" placeholder="To Date">
          <input type="text" [(ngModel)]="filter.customerName" placeholder="Customer name...">
          <select [(ngModel)]="filter.paymentMode">
            <option value="">All Payment Modes</option>
            <option>Cash</option><option>UPI</option><option>Card</option><option>Credit</option>
          </select>
          <button class="btn-primary" (click)="loadBills()">🔍 Search</button>
          <button class="btn-reset" (click)="resetFilter()">Reset</button>
        </div>

        <!-- Table -->
        <div class="table-card">
          <table>
            <thead><tr>
              <th>#</th><th>Bill No</th><th>Date</th><th>Customer</th><th>Phone</th>
              <th>Amount</th><th>Payment</th><th>Status</th><th>Created By</th><th>Actions</th>
            </tr></thead>
            <tbody>
              <tr *ngFor="let b of bills; let i=index">
                <td>{{ ((filter.page-1)*filter.pageSize) + i+1 }}</td>
                <td><strong class="bill-no">{{ b.billNumber }}</strong></td>
                <td>{{ b.billDate | date:'dd MMM yyyy' }}</td>
                <td>{{ b.customerName }}</td>
                <td>{{ b.customerPhone }}</td>
                <td class="amount">₹{{ b.totalAmount | number:'1.2-2' }}</td>
                <td><span class="payment-badge">{{ b.paymentMode }}</span></td>
                <td><span class="paid-badge" [class.unpaid]="!b.isPaid">{{ b.isPaid ? 'Paid' : 'Unpaid' }}</span></td>
                <td>{{ b.createdBy }}</td>
                <td class="actions">
                  <button class="btn-pdf" (click)="downloadPdf(b.id, b.billNumber)" title="Download PDF">📄 PDF</button>
                  <button class="btn-save" (click)="savePdf(b.id)" title="Save PDF to disk">💾</button>
                </td>
              </tr>
              <tr *ngIf="!bills.length"><td colspan="10" class="empty">No bills found</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="pagedResult?.totalPages > 1">
          <button (click)="goPage(filter.page-1)" [disabled]="filter.page<=1">◀ Prev</button>
          <span>Page {{ filter.page }} of {{ pagedResult?.totalPages }}</span>
          <button (click)="goPage(filter.page+1)" [disabled]="filter.page>=pagedResult?.totalPages">Next ▶</button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { display:flex; height:100vh; overflow:hidden; background:#f5f6fa; }
    .main { flex:1; overflow-y:auto; padding:28px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .page-header h1 { font-size:24px; font-weight:800; color:#1a237e; margin:0; }
    .chip { background:#e8eaf6; color:#3f51b5; padding:5px 12px; border-radius:12px; font-size:13px; font-weight:600; }
    .filter-bar { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
    .filter-bar input, .filter-bar select { padding:9px 14px; border:2px solid #e0e0e0; border-radius:10px; font-size:13px; }
    .btn-primary { background:#3f51b5; color:#fff; border:none; padding:9px 18px; border-radius:10px; cursor:pointer; font-weight:600; }
    .btn-reset { background:#fff; border:2px solid #e0e0e0; padding:9px 16px; border-radius:10px; cursor:pointer; font-weight:600; }
    .table-card { background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; min-width:1000px; }
    th { background:#1a237e; color:#fff; padding:12px 14px; text-align:left; font-size:12px; text-transform:uppercase; }
    td { padding:12px 14px; border-bottom:1px solid #f0f0f0; font-size:13px; }
    tr:hover td { background:#f8f9ff; }
    .bill-no { color:#3f51b5; }
    .amount { font-weight:700; color:#2e7d32; }
    .payment-badge { background:#e8eaf6; color:#3f51b5; padding:3px 10px; border-radius:12px; font-size:12px; }
    .paid-badge { background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
    .paid-badge.unpaid { background:#ffebee; color:#c62828; }
    .actions { display:flex; gap:6px; }
    .btn-pdf, .btn-save { padding:5px 12px; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; }
    .btn-pdf { background:#e8eaf6; color:#3f51b5; }
    .btn-pdf:hover { background:#3f51b5; color:#fff; }
    .btn-save { background:#e8f5e9; color:#2e7d32; }
    .empty { text-align:center; color:#999; padding:32px; }
    .pagination { display:flex; justify-content:center; align-items:center; gap:16px; margin-top:20px; }
    .pagination button { padding:8px 16px; border:2px solid #e0e0e0; background:#fff; border-radius:8px; cursor:pointer; }
    .pagination button:disabled { opacity:0.4; cursor:not-allowed; }
    .pagination span { color:#555; font-size:14px; }
  `]
})
export class AdminBillsComponent implements OnInit {
  bills: BillListItem[] = [];
  pagedResult: any = null;
  filter: BillFilter = { page: 1, pageSize: 20 };

  constructor(private billService: BillService) {}
  ngOnInit() { this.loadBills(); }

  loadBills() {
    this.billService.getAllBills(this.filter).subscribe(res => {
      if (res.success) { this.bills = res.data.data; this.pagedResult = res.data; }
    });
  }

  resetFilter() {
    this.filter = { page: 1, pageSize: 20 };
    this.loadBills();
  }

  goPage(p: number) { this.filter.page = p; this.loadBills(); }

  downloadPdf(id: number, billNo: string) {
    this.billService.downloadPdf(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${billNo}.pdf`; a.click();
      URL.revokeObjectURL(url);
    });
  }

  savePdf(id: number) {
    this.billService.savePdf(id).subscribe(res => {
      if (res.success) alert('PDF saved: ' + res.data);
    });
  }
}
