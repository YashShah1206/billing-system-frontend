import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ProductService } from '../../../core/services/product.service';
import { Category, Product, Supplier } from '../../../core/models/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>📦 Products</h1>
          <button class="btn-primary" (click)="showForm=true;editMode=false;resetForm()">+ Add Product</button>
        </div>

        <!-- Product Form Modal -->
        <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editMode ? 'Edit' : 'Add New' }} Product</h2>
              <button class="close-btn" (click)="showForm=false">✕</button>
            </div>
            <form (ngSubmit)="saveProduct()" class="product-form">
              <div class="form-grid">
                <div class="form-group span-2">
                  <label>Product Name *</label>
                  <input [(ngModel)]="form.productName" name="productName" required placeholder="Enter product name">
                </div>
                <div class="form-group">
                  <label>Product Code *</label>
                  <input [(ngModel)]="form.productCode" name="productCode" required placeholder="e.g. PROD001">
                </div>
                <div class="form-group">
                  <label>Barcode</label>
                  <input [(ngModel)]="form.barcode" name="barcode" placeholder="Optional barcode">
                </div>
                <div class="form-group">
                  <label>Buying Price (₹) *</label>
                  <input type="number" [(ngModel)]="form.buyingPrice" name="buyingPrice" required min="0" step="0.01">
                </div>
                <div class="form-group">
                  <label>Selling Price (₹) *</label>
                  <input type="number" [(ngModel)]="form.sellingPrice" name="sellingPrice" required min="0" step="0.01">
                </div>
                <div class="form-group">
                  <label>MRP (₹) *</label>
                  <input type="number" [(ngModel)]="form.mrp" name="mrp" required min="0" step="0.01">
                </div>
                <div class="form-group">
                  <label>Unit</label>
                  <select [(ngModel)]="form.unit" name="unit">
                    <option>Pcs</option><option>Kg</option><option>Ltr</option><option>Box</option><option>Pack</option><option>Dozen</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>HSN Code *</label>
                  <input type="number" [(ngModel)]="form.hsnCode" name="hsnCode" required placeholder="HSN Code">
                </div>
                <div class="form-group">
                  <label>GST Rate (%) *</label>
                  <select [(ngModel)]="form.gstRate" name="gstRate">
                    <option [value]="0">0%</option><option [value]="5">5%</option><option [value]="12">12%</option>
                    <option [value]="18">18%</option><option [value]="28">28%</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Cess Rate (%)</label>
                  <input type="number" [(ngModel)]="form.cessRate" name="cessRate" min="0" step="0.01">
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <select [(ngModel)]="form.categoryId" name="categoryId" required>
                    <option [value]="c.id" *ngFor="let c of categories">{{ c.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Supplier</label>
                  <select [(ngModel)]="form.supplierId" name="supplierId">
                    <option [value]="null">-- None --</option>
                    <option [value]="s.id" *ngFor="let s of suppliers">{{ s.supplierName }}</option>
                  </select>
                </div>
                <div class="form-group" *ngIf="!editMode">
                  <label>Initial Stock</label>
                  <input type="number" [(ngModel)]="form.initialStock" name="initialStock" min="0">
                </div>
                <div class="form-group">
                  <label>Min Stock Alert</label>
                  <input type="number" [(ngModel)]="form.minStockAlert" name="minStockAlert" min="0">
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="showForm=false">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="saving">{{ saving ? 'Saving...' : 'Save Product' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Search -->
        <div class="search-bar">
          <input [(ngModel)]="search" placeholder="🔍 Search products...">
        </div>

        <!-- Products Table -->
        <div class="table-card">
          <table>
            <thead><tr>
              <th>#</th><th>Product</th><th>Code</th><th>Category</th>
              <th>Buy Price</th><th>Sell Price</th><th>MRP</th><th>GST</th><th>Stock</th><th>Actions</th>
            </tr></thead>
            <tbody>
              <tr *ngFor="let p of filteredProducts; let i=index" [class.low-stock]="p.isLowStock">
                <td>{{ i+1 }}</td>
                <td>
                  <strong>{{ p.productName }}</strong>
                  <div class="low-alert" *ngIf="p.isLowStock">⚠️ Low Stock</div>
                </td>
                <td><code>{{ p.productCode }}</code></td>
                <td>{{ p.categoryName }}</td>
                <td>₹{{ p.buyingPrice | number:'1.2-2' }}</td>
                <td>₹{{ p.sellingPrice | number:'1.2-2' }}</td>
                <td>₹{{ p.mrp | number:'1.2-2' }}</td>
                <td>{{ p.gstRate }}%</td>
                <td>
                  <span class="stock-num" [class.zero]="p.currentStock===0" [class.low]="p.isLowStock && p.currentStock>0">
                    {{ p.currentStock }} {{ p.unit }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-edit" (click)="editProduct(p)">✏️</button>
                  <button class="btn-del" (click)="deleteProduct(p.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="!filteredProducts.length"><td colspan="10" class="empty">No products found</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { display:flex; height:100vh; overflow:hidden; background:#f5f6fa; }
    .main { flex:1; overflow-y:auto; padding:28px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .page-header h1 { font-size:24px; font-weight:800; color:#1a237e; margin:0; }
    .btn-primary { background:linear-gradient(135deg,#3f51b5,#1a237e); color:#fff; border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer; font-size:14px; }
    .btn-primary:disabled { opacity:0.6; }
    .search-bar { margin-bottom:16px; }
    .search-bar input { width:100%; max-width:400px; padding:10px 16px; border:2px solid #e0e0e0; border-radius:10px; font-size:14px; }
    .table-card { background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; min-width:900px; }
    th { background:#1a237e; color:#fff; padding:12px 14px; text-align:left; font-size:12px; text-transform:uppercase; }
    td { padding:12px 14px; border-bottom:1px solid #f0f0f0; font-size:13px; }
    tr.low-stock { background:#fffde7; }
    .low-alert { font-size:11px; color:#f57f17; }
    .stock-num { font-weight:700; color:#2e7d32; }
    .stock-num.zero { color:#c62828; }
    .stock-num.low { color:#f57f17; }
    .actions { display:flex; gap:6px; }
    .btn-edit,.btn-del { padding:5px 10px; border:none; border-radius:6px; cursor:pointer; font-size:14px; }
    .btn-edit { background:#e8eaf6; }
    .btn-del { background:#ffebee; }
    code { background:#e8eaf6; color:#3f51b5; padding:2px 6px; border-radius:4px; font-size:11px; }
    .empty { text-align:center; color:#999; padding:32px; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal { background:#fff; border-radius:20px; width:800px; max-width:95vw; max-height:90vh; overflow-y:auto; }
    .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #f0f0f0; }
    .modal-header h2 { margin:0; font-size:18px; color:#1a237e; }
    .close-btn { background:none; border:none; font-size:20px; cursor:pointer; color:#666; }
    .product-form { padding:24px; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .span-2 { grid-column:span 2; }
    .form-group label { display:block; font-size:13px; font-weight:600; color:#333; margin-bottom:6px; }
    .form-group input, .form-group select { width:100%; padding:10px 14px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    .form-group input:focus, .form-group select:focus { outline:none; border-color:#3f51b5; }
    .modal-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid #f0f0f0; }
    .btn-cancel { padding:10px 20px; border:2px solid #e0e0e0; background:#fff; border-radius:8px; cursor:pointer; font-weight:600; }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  showForm = false;
  editMode = false;
  saving = false;
  search = '';
  editId: number | null = null;
  form: any = {};

  get filteredProducts() {
    return this.products.filter(p =>
      p.productName.toLowerCase().includes(this.search.toLowerCase()) ||
      p.productCode.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.productService.getCategories().subscribe(r => { if (r.success) this.categories = r.data; });
    this.productService.getSuppliers().subscribe(r => { if (r.success) this.suppliers = r.data; });
  }

  loadProducts() {
    this.productService.getAll().subscribe(r => { if (r.success) this.products = r.data; });
  }

  resetForm() {
    this.form = { productName:'', productCode:'', barcode:'', buyingPrice:0, sellingPrice:0, mrp:0, unit:'Pcs', hsnCode:0, gstRate:18, cessRate:0, categoryId: this.categories[0]?.id, supplierId:null, initialStock:0, minStockAlert:5 };
  }

  editProduct(p: Product) {
    this.editMode = true;
    this.editId = p.id;
    this.form = { ...p };
    this.showForm = true;
  }

  saveProduct() {
    this.saving = true;
    const obs = this.editMode
      ? this.productService.update(this.editId!, this.form)
      : this.productService.create(this.form);
    obs.subscribe({
      next: r => {
        this.saving = false;
        if (r.success) { this.showForm = false; this.loadProducts(); }
      },
      error: () => { this.saving = false; }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product?')) {
      this.productService.delete(id).subscribe(r => { if (r.success) this.loadProducts(); });
    }
  }
}
