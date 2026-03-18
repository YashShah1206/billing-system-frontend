import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ProductService } from '../../../core/services/product.service';
import { Product, PurchaseOrder, Supplier } from '../../../core/models/models';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>🛒 Purchase Orders</h1>
          <button class="btn-primary" (click)="showForm=true;resetForm()">+ New Purchase</button>
        </div>

        <!-- Purchase Form -->
        <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header"><h2>New Purchase Order</h2><button (click)="showForm=false" class="close-btn">✕</button></div>
            <div class="form-body">
              <div class="form-grid">
                <div class="form-group"><label>Purchase Bill No *</label><input [(ngModel)]="form.purchaseBillNumber" name="pbn" required placeholder="Supplier bill number"></div>
                <div class="form-group"><label>Purchase Date *</label><input type="date" [(ngModel)]="form.purchaseDate" name="pd" required></div>
                <div class="form-group span-2"><label>Supplier *</label>
                  <select [(ngModel)]="form.supplierId" name="sup" required>
                    <option [value]="s.id" *ngFor="let s of suppliers">{{ s.supplierName }} - {{ s.city }}</option>
                  </select>
                </div>
              </div>

              <div class="items-section">
                <div class="items-header">
                  <h3>Purchase Items</h3>
                  <button type="button" class="btn-add-item" (click)="addItem()">+ Add Item</button>
                </div>
                <table class="items-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Buying Price</th><th>GST%</th><th>Total</th><th></th></tr></thead>
                  <tbody>
                    <tr *ngFor="let item of form.items; let i=index">
                      <td>
                        <select [(ngModel)]="item.productId" [name]="'p'+i" (change)="onProductChange(item)">
                          <option [value]="p.id" *ngFor="let p of products">{{ p.productName }}</option>
                        </select>
                      </td>
                      <td><input type="number" [(ngModel)]="item.quantity" [name]="'q'+i" min="1" (input)="calcItem(item)" style="width:70px"></td>
                      <td><input type="number" [(ngModel)]="item.buyingPrice" [name]="'bp'+i" step="0.01" (input)="calcItem(item)" style="width:100px"></td>
                      <td>
                        <select [(ngModel)]="item.gstRate" [name]="'g'+i" (change)="calcItem(item)" style="width:70px">
                          <option [value]="0">0%</option><option [value]="5">5%</option><option [value]="12">12%</option><option [value]="18">18%</option><option [value]="28">28%</option>
                        </select>
                      </td>
                      <td><strong>₹{{ item._total | number:'1.2-2' }}</strong></td>
                      <td><button type="button" class="btn-del-item" (click)="removeItem(i)">✕</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="po-totals">
                <div class="po-total-row"><span>Sub Total:</span><strong>₹{{ poSubTotal | number:'1.2-2' }}</strong></div>
                <div class="po-total-row"><span>Total GST:</span><strong>₹{{ poGst | number:'1.2-2' }}</strong></div>
                <div class="po-total-row total"><span>Grand Total:</span><strong>₹{{ poTotal | number:'1.2-2' }}</strong></div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="showForm=false">Cancel</button>
                <button type="button" class="btn-primary" (click)="savePO()" [disabled]="saving">{{ saving ? 'Saving...' : 'Save Purchase Order' }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- PO List -->
        <div class="table-card">
          <table>
            <thead><tr><th>#</th><th>Bill No</th><th>Date</th><th>Supplier</th><th>Sub Total</th><th>GST</th><th>Grand Total</th><th>By</th></tr></thead>
            <tbody>
              <tr *ngFor="let po of orders; let i=index">
                <td>{{ i+1 }}</td>
                <td><strong>{{ po.purchaseBillNumber }}</strong></td>
                <td>{{ po.purchaseDate | date:'dd MMM yyyy' }}</td>
                <td>{{ po.supplierName }}</td>
                <td>₹{{ po.subTotal | number:'1.2-2' }}</td>
                <td>₹{{ po.totalGst | number:'1.2-2' }}</td>
                <td><strong class="amount">₹{{ po.totalAmount | number:'1.2-2' }}</strong></td>
                <td>{{ po.createdBy }}</td>
              </tr>
              <tr *ngIf="!orders.length"><td colspan="8" class="empty">No purchase orders found</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .page-header h1{font-size:24px;font-weight:800;color:#1a237e;margin:0}
    .btn-primary{background:#1a237e;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-weight:700;cursor:pointer}
    .btn-primary:disabled{opacity:0.6}
    .table-card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:auto}
    table{width:100%;border-collapse:collapse}
    th{background:#1a237e;color:#fff;padding:12px 14px;text-align:left;font-size:12px;text-transform:uppercase}
    td{padding:12px 14px;border-bottom:1px solid #f0f0f0;font-size:13px}
    .amount{color:#2e7d32} .empty{text-align:center;color:#999;padding:32px}
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000}
    .modal{background:#fff;border-radius:20px;width:900px;max-width:96vw;max-height:92vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header h2{margin:0;font-size:18px;color:#1a237e} .close-btn{background:none;border:none;font-size:20px;cursor:pointer}
    .form-body{padding:24px}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
    .span-2{grid-column:span 2}
    .form-group label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
    .form-group input,.form-group select{width:100%;padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px;box-sizing:border-box}
    .items-section{border:2px solid #e8eaf6;border-radius:12px;padding:16px;margin-bottom:20px}
    .items-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .items-header h3{margin:0;font-size:15px;font-weight:700;color:#1a237e}
    .btn-add-item{background:#e8eaf6;color:#3f51b5;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-weight:600}
    .items-table{width:100%;border-collapse:collapse}
    .items-table th{background:#f5f6fa;padding:8px 10px;font-size:12px;text-align:left}
    .items-table td{padding:8px 10px;border-bottom:1px solid #f0f0f0}
    .items-table input,.items-table select{padding:6px 10px;border:2px solid #e0e0e0;border-radius:6px;font-size:13px}
    .btn-del-item{background:#ffebee;color:#c62828;border:none;padding:5px 10px;border-radius:6px;cursor:pointer}
    .po-totals{display:flex;flex-direction:column;align-items:flex-end;gap:8px;margin-bottom:20px}
    .po-total-row{display:flex;gap:20px;font-size:14px}
    .po-total-row.total{font-size:18px;font-weight:800;color:#1a237e;padding-top:8px;border-top:2px solid #1a237e}
    .modal-actions{display:flex;justify-content:flex-end;gap:12px;padding-top:16px;border-top:1px solid #f0f0f0}
    .btn-cancel{padding:10px 20px;border:2px solid #e0e0e0;background:#fff;border-radius:8px;cursor:pointer;font-weight:600}
  `]
})
export class PurchasesComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  products: Product[] = [];
  suppliers: Supplier[] = [];
  showForm = false;
  saving = false;
  form: any = {};

  get poSubTotal() { return (this.form.items||[]).reduce((s: number, i: any) => s + (i.buyingPrice||0)*(i.quantity||0), 0); }
  get poGst() { return (this.form.items||[]).reduce((s: number, i: any) => s + ((i.buyingPrice||0)*(i.quantity||0)*(i.gstRate||0)/100), 0); }
  get poTotal() { return this.poSubTotal + this.poGst; }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getPurchaseOrders().subscribe(r => { if (r.success) this.orders = r.data; });
    this.productService.getAll().subscribe(r => { if (r.success) this.products = r.data; });
    this.productService.getSuppliers().subscribe(r => { if (r.success) this.suppliers = r.data; });
  }

  resetForm() {
    this.form = { purchaseBillNumber:'', purchaseDate: new Date().toISOString().split('T')[0], supplierId: this.suppliers[0]?.id, items: [] };
    this.addItem();
  }

  addItem() {
    this.form.items.push({ productId: this.products[0]?.id, quantity: 1, buyingPrice: 0, gstRate: 18, cessRate: 0, _total: 0 });
  }

  removeItem(i: number) { this.form.items.splice(i, 1); }

  onProductChange(item: any) {
    const p = this.products.find(x => x.id == item.productId);
    if (p) { item.buyingPrice = p.buyingPrice; item.gstRate = p.gstRate; this.calcItem(item); }
  }

  calcItem(item: any) {
    const base = (item.buyingPrice||0) * (item.quantity||0);
    item._total = base + (base * (item.gstRate||0) / 100);
  }

  savePO() {
    this.saving = true;
    this.productService.createPurchaseOrder(this.form).subscribe({
      next: r => {
        this.saving = false;
        if (r.success) { this.orders.unshift(r.data); this.showForm = false; }
      },
      error: () => { this.saving = false; }
    });
  }
}
