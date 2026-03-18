import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/models';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>🏪 Shop Settings</h1>
          <button class="btn-primary" (click)="save()" [disabled]="saving">{{ saving ? 'Saving...' : '💾 Save Changes' }}</button>
        </div>
        <div class="success-msg" *ngIf="saved">✅ Shop details updated successfully!</div>
        <div class="form-sections" *ngIf="shop">
          <div class="form-section">
            <h2>Basic Information</h2>
            <div class="form-grid">
              <div class="form-group span-2"><label>Shop Name *</label><input [(ngModel)]="shop.shopName" required></div>
              <div class="form-group"><label>Owner Name *</label><input [(ngModel)]="shop.ownerName" required></div>
              <div class="form-group"><label>Phone Number *</label><input [(ngModel)]="shop.phoneNumber" required></div>
              <div class="form-group span-2"><label>Email</label><input type="email" [(ngModel)]="shop.email"></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Address</h2>
            <div class="form-grid">
              <div class="form-group span-2"><label>Address *</label><input [(ngModel)]="shop.address" required></div>
              <div class="form-group"><label>City *</label><input [(ngModel)]="shop.city" required></div>
              <div class="form-group"><label>State *</label><input [(ngModel)]="shop.state" required></div>
              <div class="form-group"><label>Pin Code *</label><input [(ngModel)]="shop.pinCode" required></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Tax Information</h2>
            <div class="form-grid">
              <div class="form-group"><label>GST Number (GSTIN) *</label><input [(ngModel)]="shop.gstNumber" placeholder="15-character GSTIN" maxlength="15"></div>
              <div class="form-group"><label>PAN Number *</label><input [(ngModel)]="shop.panNumber" placeholder="10-character PAN" maxlength="10"></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Bank Details</h2>
            <div class="form-grid">
              <div class="form-group"><label>Bank Name</label><input [(ngModel)]="shop.bankName"></div>
              <div class="form-group"><label>Account Number</label><input [(ngModel)]="shop.accountNumber"></div>
              <div class="form-group"><label>IFSC Code</label><input [(ngModel)]="shop.ifscCode"></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Invoice Settings</h2>
            <div class="form-group">
              <label>Terms & Conditions (shown on bills)</label>
              <textarea [(ngModel)]="shop.termsAndConditions" rows="4" placeholder="Enter terms and conditions..."></textarea>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout{display:flex;height:100vh;overflow:hidden;background:#f5f6fa}
    .main{flex:1;overflow-y:auto;padding:28px}
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .page-header h1{font-size:24px;font-weight:800;color:#1a237e;margin:0}
    .btn-primary{background:#1a237e;color:#fff;border:none;padding:11px 24px;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px}
    .btn-primary:disabled{opacity:0.6}
    .success-msg{background:#e8f5e9;color:#2e7d32;padding:12px 16px;border-radius:10px;margin-bottom:20px;font-weight:600}
    .form-sections{display:flex;flex-direction:column;gap:20px}
    .form-section{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
    .form-section h2{font-size:16px;font-weight:700;color:#1a237e;margin:0 0 16px;padding-bottom:10px;border-bottom:2px solid #e8eaf6}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .span-2{grid-column:span 2}
    .form-group label{display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:6px}
    .form-group input,.form-group textarea{width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:14px;box-sizing:border-box;font-family:inherit}
    .form-group input:focus,.form-group textarea:focus{outline:none;border-color:#3f51b5}
    textarea{resize:vertical}
  `]
})
export class ShopComponent implements OnInit {
  shop: Shop | null = null;
  saving = false;
  saved = false;

  constructor(private shopService: ShopService) {}
  ngOnInit() { this.shopService.getShop().subscribe(r => { if (r.success) this.shop = r.data; }); }

  save() {
    if (!this.shop) return;
    this.saving = true;
    this.shopService.updateShop(this.shop).subscribe({
      next: r => { this.saving = false; if (r.success) { this.saved = true; setTimeout(() => this.saved = false, 3000); } },
      error: () => { this.saving = false; }
    });
  }
}
