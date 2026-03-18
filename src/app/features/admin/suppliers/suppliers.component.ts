import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ProductService } from '../../../core/services/product.service';
import { Supplier } from '../../../core/models/models';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>🏭 Suppliers</h1>
          <button class="btn-primary" (click)="showForm=true;resetForm()">+ Add Supplier</button>
        </div>
        <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header"><h2>Add Supplier</h2><button (click)="showForm=false" class="close-btn">✕</button></div>
            <form (ngSubmit)="save()" class="form-body">
              <div class="form-grid">
                <div class="form-group"><label>Supplier Name *</label><input [(ngModel)]="form.supplierName" name="sn" required placeholder="Company name"></div>
                <div class="form-group"><label>Contact Person *</label><input [(ngModel)]="form.contactPerson" name="cp" required></div>
                <div class="form-group"><label>Phone *</label><input [(ngModel)]="form.phoneNumber" name="ph" required></div>
                <div class="form-group"><label>Email</label><input [(ngModel)]="form.email" name="em" type="email"></div>
                <div class="form-group span-2"><label>Address</label><input [(ngModel)]="form.address" name="addr"></div>
                <div class="form-group"><label>City</label><input [(ngModel)]="form.city" name="city"></div>
                <div class="form-group"><label>State</label><input [(ngModel)]="form.state" name="state"></div>
                <div class="form-group"><label>GST Number</label><input [(ngModel)]="form.gstNumber" name="gst" placeholder="15-digit GSTIN"></div>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="showForm=false">Cancel</button>
                <button type="submit" class="btn-primary">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
        <div class="table-card">
          <table>
            <thead><tr><th>#</th><th>Supplier</th><th>Contact</th><th>Phone</th><th>Email</th><th>City</th><th>GSTIN</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of suppliers; let i=index">
                <td>{{ i+1 }}</td><td><strong>{{ s.supplierName }}</strong></td><td>{{ s.contactPerson }}</td>
                <td>{{ s.phoneNumber }}</td><td>{{ s.email }}</td><td>{{ s.city }}, {{ s.state }}</td>
                <td><code>{{ s.gstNumber }}</code></td>
              </tr>
              <tr *ngIf="!suppliers.length"><td colspan="7" class="empty">No suppliers added yet</td></tr>
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
    .table-card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:auto}
    table{width:100%;border-collapse:collapse}
    th{background:#1a237e;color:#fff;padding:12px 14px;text-align:left;font-size:12px;text-transform:uppercase}
    td{padding:12px 14px;border-bottom:1px solid #f0f0f0;font-size:13px}
    code{background:#e8eaf6;color:#3f51b5;padding:2px 8px;border-radius:4px;font-size:11px}
    .empty{text-align:center;color:#999;padding:32px}
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000}
    .modal{background:#fff;border-radius:20px;width:700px;max-width:95vw;max-height:90vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header h2{margin:0;font-size:18px;color:#1a237e} .close-btn{background:none;border:none;font-size:20px;cursor:pointer}
    .form-body{padding:24px}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .span-2{grid-column:span 2}
    .form-group label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
    .form-group input{width:100%;padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px;box-sizing:border-box}
    .modal-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid #f0f0f0}
    .btn-cancel{padding:10px 20px;border:2px solid #e0e0e0;background:#fff;border-radius:8px;cursor:pointer;font-weight:600}
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  showForm = false;
  form: any = {};

  constructor(private productService: ProductService) {}
  ngOnInit() { this.productService.getSuppliers().subscribe(r => { if (r.success) this.suppliers = r.data; }); }

  resetForm() { this.form = { supplierName:'',contactPerson:'',phoneNumber:'',email:'',address:'',city:'',state:'',gstNumber:'' }; }

  save() {
    this.productService.createSupplier(this.form).subscribe(r => {
      if (r.success) { this.suppliers.push(r.data); this.showForm = false; }
    });
  }
}
