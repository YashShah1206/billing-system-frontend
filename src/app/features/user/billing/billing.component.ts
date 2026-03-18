import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ProductService } from '../../../core/services/product.service';
import { BillService } from '../../../core/services/bill.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <div>
            <h1>➕ Create New Bill</h1>
            <p class="sub">Fill in customer details and add products</p>
          </div>
          <button class="btn-cancel-bill" (click)="router.navigate(['/user/dashboard'])">← Back</button>
        </div>

        <div *ngIf="billCreated" class="success-banner">
          <div class="success-icon">🎉</div>
          <div>
            <h3>Bill Created Successfully!</h3>
            <p>Bill Number: <strong>{{ createdBill?.billNumber }}</strong> | Amount: <strong>₹{{ createdBill?.totalAmount | number:'1.2-2' }}</strong></p>
          </div>
          <div class="success-actions">
            <button class="btn-pdf" (click)="downloadPdf()">📄 Download PDF</button>
            <button class="btn-new" (click)="newBill()">+ New Bill</button>
          </div>
        </div>

        <div class="bill-form" *ngIf="!billCreated">
          <div class="form-row">
            <!-- Customer Details -->
            <div class="form-card">
              <h2>👤 Customer Details</h2>
              <div class="form-grid">
                <div class="form-group span-2"><label>Customer Name *</label><input [(ngModel)]="bill.customerName" required placeholder="Full name"></div>
                <div class="form-group"><label>Phone *</label><input [(ngModel)]="bill.customerPhone" required placeholder="Mobile number"></div>
                <div class="form-group"><label>Email</label><input [(ngModel)]="bill.customerEmail" type="email" placeholder="Optional"></div>
                <div class="form-group span-2"><label>Address</label><input [(ngModel)]="bill.customerAddress" placeholder="Customer address"></div>
                <div class="form-group"><label>Customer State *</label>
                  <select [(ngModel)]="bill.customerState" (change)="onStateChange()">
                    <option value="Gujarat">Gujarat</option><option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option><option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option><option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>
                <div class="form-group"><label>Customer GSTIN</label><input [(ngModel)]="bill.customerGstNumber" placeholder="For B2B billing"></div>
              </div>
            </div>

            <!-- Bill Settings -->
            <div class="form-card bill-settings">
              <h2>⚙️ Bill Settings</h2>
              <div class="form-group"><label>Bill Date *</label><input type="date" [(ngModel)]="bill.billDate" required></div>
              <div class="form-group"><label>Payment Mode *</label>
                <select [(ngModel)]="bill.paymentMode">
                  <option>Cash</option><option>UPI</option><option>Card</option><option>Credit</option><option>Cheque</option>
                </select>
              </div>
              <div class="form-group"><label>Bill Discount (%)</label>
                <input type="number" [(ngModel)]="bill.discountPercent" min="0" max="100" step="0.5" (input)="calcTotals()">
              </div>
              <div class="form-group">
                <label>GST Type</label>
                <div class="gst-type-info">
                  <span class="gst-badge" [class.active]="bill.gstType===1">{{ bill.gstType===1 ? '✅' : '○' }} CGST + SGST (Intra-state)</span>
                  <span class="gst-badge" [class.active]="bill.gstType===2">{{ bill.gstType===2 ? '✅' : '○' }} IGST (Inter-state)</span>
                </div>
                <small class="gst-note">Auto-detected based on customer state</small>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="bill.isPaid"> Mark as Paid
                </label>
              </div>
            </div>
          </div>

          <!-- Product Items -->
          <div class="form-card items-card">
            <div class="items-header">
              <h2>📦 Bill Items</h2>
              <button class="btn-add-item" (click)="addItem()">+ Add Product</button>
            </div>
            <div class="table-wrapper">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>#</th><th>Product</th><th>MRP</th><th>Sell Price</th>
                    <th>Qty</th><th>Disc%</th><th>GST%</th><th>Total</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of bill.items; let i=index" [class.low-stock]="isLowStock(item.productId)">
                    <td>{{ i+1 }}</td>
                    <td>
                      <select [(ngModel)]="item.productId" [name]="'prod'+i" (change)="onProductSelect(item)" class="product-select">
                        <option [value]="p.id" *ngFor="let p of products">{{ p.productName }} (Stk: {{ p.currentStock }})</option>
                      </select>
                    </td>
                    <td class="mrp-col">₹{{ getMrp(item.productId) | number:'1.2-2' }}</td>
                    <td><input type="number" [(ngModel)]="item.sellingPrice" [name]="'sp'+i" min="0" step="0.01" (input)="calcTotals()" class="price-input"></td>
                    <td><input type="number" [(ngModel)]="item.quantity" [name]="'qty'+i" min="1" [max]="getStock(item.productId)" (input)="calcTotals()" class="qty-input"></td>
                    <td><input type="number" [(ngModel)]="item.discountPercent" [name]="'dp'+i" min="0" max="100" step="0.5" (input)="calcTotals()" class="disc-input"></td>
                    <td class="gst-col">{{ getGstRate(item.productId) }}%</td>
                    <td class="total-col"><strong>₹{{ getItemTotal(item) | number:'1.2-2' }}</strong></td>
                    <td><button class="del-btn" (click)="removeItem(i)">✕</button></td>
                  </tr>
                  <tr *ngIf="!bill.items.length">
                    <td colspan="9" class="empty-items">Click "Add Product" to add items to this bill</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bill Summary -->
          <div class="bill-summary-row">
            <div class="summary-card">
              <div class="sum-row"><span>Sub Total</span><strong>₹{{ subTotal | number:'1.2-2' }}</strong></div>
              <div class="sum-row" *ngIf="bill.discountPercent>0"><span>Discount ({{ bill.discountPercent }}%)</span><strong class="disc">-₹{{ discountAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row"><span>Taxable Amount</span><strong>₹{{ taxableAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row" *ngIf="bill.gstType===1"><span>CGST</span><strong>₹{{ cgstAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row" *ngIf="bill.gstType===1"><span>SGST</span><strong>₹{{ sgstAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row" *ngIf="bill.gstType===2"><span>IGST</span><strong>₹{{ igstAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row" *ngIf="cessAmount>0"><span>Cess</span><strong>₹{{ cessAmount | number:'1.2-2' }}</strong></div>
              <div class="sum-row total"><span>Grand Total</span><strong>₹{{ grandTotal | number:'1.2-2' }}</strong></div>
            </div>
            <button class="btn-generate" (click)="generateBill()" [disabled]="generating || !bill.items.length || !bill.customerName">
              {{ generating ? '⏳ Generating...' : '🧾 Generate Bill' }}
            </button>
          </div>

          <div class="error-msg" *ngIf="errorMsg">⚠️ {{ errorMsg }}</div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
    .page-header h1{font-size:24px;font-weight:800;color:#1a237e;margin:0 0 4px}
    .sub{color:#666;font-size:13px;margin:0}
    .btn-cancel-bill{background:#fff;border:2px solid #e0e0e0;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:600;color:#555}
    .success-banner{background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border:2px solid #2e7d32;border-radius:16px;padding:24px;display:flex;align-items:center;gap:20px;margin-bottom:20px}
    .success-icon{font-size:40px}
    .success-banner h3{margin:0 0 4px;color:#2e7d32;font-size:18px}
    .success-banner p{margin:0;color:#333;font-size:14px}
    .success-actions{margin-left:auto;display:flex;gap:10px}
    .btn-pdf{background:#1a237e;color:#fff;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:700}
    .btn-new{background:#fff;border:2px solid #1a237e;color:#1a237e;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:700}
    .bill-form{display:flex;flex-direction:column;gap:20px}
    .form-row{display:grid;grid-template-columns:2fr 1fr;gap:20px}
    .form-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .form-card h2{font-size:16px;font-weight:700;color:#1a237e;margin:0 0 16px;padding-bottom:10px;border-bottom:2px solid #e8eaf6}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .span-2{grid-column:span 2}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-group label{font-size:13px;font-weight:600;color:#555}
    .form-group input,.form-group select{padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px}
    .form-group input:focus,.form-group select:focus{outline:none;border-color:#3f51b5}
    .gst-type-info{display:flex;flex-direction:column;gap:6px;margin-top:4px}
    .gst-badge{padding:7px 12px;border-radius:8px;background:#f5f6fa;font-size:13px;border:2px solid #e0e0e0}
    .gst-badge.active{background:#e8eaf6;border-color:#3f51b5;color:#1a237e;font-weight:600}
    .gst-note{color:#999;font-size:11px;margin-top:4px}
    .checkbox-label{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;font-weight:600;color:#333}
    .items-card{padding:24px}
    .items-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .items-header h2{font-size:16px;font-weight:700;color:#1a237e;margin:0}
    .btn-add-item{background:#1a237e;color:#fff;border:none;padding:9px 18px;border-radius:10px;cursor:pointer;font-weight:700}
    .table-wrapper{overflow-x:auto}
    .items-table{width:100%;border-collapse:collapse;min-width:800px}
    .items-table th{background:#1a237e;color:#fff;padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase}
    .items-table td{padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px}
    .items-table tr.low-stock{background:#fffde7}
    .product-select{width:200px;padding:7px 10px;border:2px solid #e0e0e0;border-radius:7px;font-size:13px}
    .price-input{width:90px;padding:7px 10px;border:2px solid #e0e0e0;border-radius:7px;font-size:13px}
    .qty-input{width:60px;padding:7px 10px;border:2px solid #e0e0e0;border-radius:7px;font-size:13px}
    .disc-input{width:60px;padding:7px 10px;border:2px solid #e0e0e0;border-radius:7px;font-size:13px}
    .mrp-col{color:#999;font-size:12px}
    .gst-col{color:#3f51b5;font-weight:600}
    .total-col{color:#2e7d32;font-weight:700}
    .del-btn{background:#ffebee;border:none;color:#c62828;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:14px}
    .empty-items{text-align:center;color:#999;padding:24px;font-style:italic}
    .bill-summary-row{display:flex;gap:20px;align-items:flex-start}
    .summary-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);flex:1;max-width:400px;margin-left:auto}
    .sum-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:14px}
    .sum-row.total{font-size:18px;font-weight:800;border-bottom:none;border-top:2px solid #1a237e;padding-top:12px;margin-top:4px;color:#1a237e}
    .disc{color:#c62828}
    .btn-generate{background:linear-gradient(135deg,#ffd740,#ffab00);border:none;color:#1a237e;padding:16px 32px;border-radius:14px;font-size:16px;font-weight:800;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;white-space:nowrap;align-self:center}
    .btn-generate:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,171,0,0.4)}
    .btn-generate:disabled{opacity:0.6;cursor:not-allowed}
    .error-msg{background:#ffebee;color:#c62828;padding:14px;border-radius:10px;font-weight:600}
  `]
})
export class BillingComponent implements OnInit {
  products: Product[] = [];
  bill: any = this.newBillObj();
  generating = false;
  billCreated = false;
  createdBill: any = null;
  errorMsg = '';

  // Totals
  subTotal = 0; discountAmount = 0; taxableAmount = 0;
  cgstAmount = 0; sgstAmount = 0; igstAmount = 0; cessAmount = 0; grandTotal = 0;

  // Shop state for GST detection
  shopState = 'Gujarat';

  constructor(
    private productService: ProductService,
    private billService: BillService,
    public router: Router
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe(r => { if (r.success) this.products = r.data; });
  }

  newBillObj() {
    return {
      billDate: new Date().toISOString().split('T')[0],
      customerName: '', customerPhone: '', customerEmail: '',
      customerAddress: '', customerGstNumber: '', customerState: 'Gujarat',
      discountPercent: 0, paymentMode: 'Cash', isPaid: true,
      gstType: 1, items: []
    };
  }

  addItem() {
    const p = this.products[0];
    this.bill.items.push({
      productId: p?.id, quantity: 1,
      sellingPrice: p?.sellingPrice || 0, discountPercent: 0
    });
    this.calcTotals();
  }

  removeItem(i: number) { this.bill.items.splice(i, 1); this.calcTotals(); }

  onProductSelect(item: any) {
    const p = this.products.find(x => x.id == item.productId);
    if (p) { item.sellingPrice = p.sellingPrice; this.calcTotals(); }
  }

  onStateChange() {
    // Auto-detect GST type: if customer state != shop state => IGST
    this.bill.gstType = this.bill.customerState === this.shopState ? 1 : 2;
    this.calcTotals();
  }

  getProduct(id: number) { return this.products.find(p => p.id == id); }
  getMrp(id: number) { return this.getProduct(id)?.mrp || 0; }
  getStock(id: number) { return this.getProduct(id)?.currentStock || 0; }
  getGstRate(id: number) { return this.getProduct(id)?.gstRate || 0; }
  isLowStock(id: number) { const p = this.getProduct(id); return p && p.currentStock <= p.minStockAlert; }

  getItemTotal(item: any) {
    const p = this.getProduct(item.productId);
    if (!p) return 0;
    const base = (item.sellingPrice || 0) * (item.quantity || 0);
    const disc = base * (item.discountPercent || 0) / 100;
    const billDisc = (base - disc) * (this.bill.discountPercent || 0) / 100;
    const taxable = base - disc - billDisc;
    const gst = taxable * p.gstRate / 100;
    const cess = taxable * p.cessRate / 100;
    return taxable + gst + cess;
  }

  calcTotals() {
    let sub = 0, disc = 0, taxable = 0, cgst = 0, sgst = 0, igst = 0, cess = 0;
    for (const item of this.bill.items) {
      const p = this.getProduct(item.productId);
      if (!p) continue;
      const lineBase = (item.sellingPrice || 0) * (item.quantity || 0);
      const lineDisc = lineBase * (item.discountPercent || 0) / 100;
      const billDisc = (lineBase - lineDisc) * (this.bill.discountPercent || 0) / 100;
      const lineTaxable = lineBase - lineDisc - billDisc;
      sub += lineBase;
      disc += lineDisc + billDisc;
      taxable += lineTaxable;
      if (this.bill.gstType === 1) { cgst += lineTaxable * p.gstRate / 2 / 100; sgst += lineTaxable * p.gstRate / 2 / 100; }
      else { igst += lineTaxable * p.gstRate / 100; }
      cess += lineTaxable * p.cessRate / 100;
    }
    this.subTotal = sub; this.discountAmount = disc; this.taxableAmount = taxable;
    this.cgstAmount = cgst; this.sgstAmount = sgst; this.igstAmount = igst; this.cessAmount = cess;
    this.grandTotal = Math.round(taxable + cgst + sgst + igst + cess);
  }

  generateBill() {
    if (!this.bill.customerName || !this.bill.items.length) return;
    this.generating = true;
    this.errorMsg = '';
    this.billService.createBill(this.bill).subscribe({
      next: res => {
        this.generating = false;
        if (res.success) { this.createdBill = res.data; this.billCreated = true; }
      },
      error: err => {
        this.generating = false;
        this.errorMsg = err.error?.message || 'Failed to generate bill. Please try again.';
      }
    });
  }

  downloadPdf() {
    if (!this.createdBill) return;
    this.billService.downloadPdf(this.createdBill.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${this.createdBill.billNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    });
  }

  newBill() {
    this.bill = this.newBillObj();
    this.billCreated = false;
    this.createdBill = null;
    this.subTotal = 0; this.discountAmount = 0; this.taxableAmount = 0;
    this.cgstAmount = 0; this.sgstAmount = 0; this.igstAmount = 0; this.grandTotal = 0;
  }
}
