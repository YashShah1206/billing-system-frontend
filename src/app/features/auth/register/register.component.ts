import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-bg">
      <div class="auth-card" *ngIf="!registered">
        <div class="auth-logo">
          <div class="logo-icon">🧾</div>
          <h1>Create Account</h1>
          <p>Join BillPro Billing System</p>
        </div>
        <form (ngSubmit)="onRegister()" #f="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="model.fullName" name="fullName" placeholder="Your full name" required>
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" [(ngModel)]="model.phoneNumber" name="phoneNumber" placeholder="Mobile number" required>
            </div>
          </div>
          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" [(ngModel)]="model.email" name="email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label>Password *</label>
            <input type="password" [(ngModel)]="model.password" name="password" placeholder="Minimum 6 characters" required minlength="6">
          </div>
          <div class="form-group">
            <label>Register As *</label>
            <select [(ngModel)]="model.role" name="role">
              <option [value]="2">User (Billing Staff)</option>
              <option [value]="1">Admin</option>
            </select>
          </div>
          <div class="info-box" *ngIf="model.role == 2">
            ℹ️ User accounts require <strong>Admin Approval</strong> before you can login and create bills.
          </div>
          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Create Account' }}
          </button>
        </form>
        <div class="auth-footer">
          Already have an account? <a routerLink="/auth/login">Sign In</a>
        </div>
      </div>
      <div class="auth-card success-card" *ngIf="registered">
        <div class="success-icon">✅</div>
        <h2>Registration Successful!</h2>
        <p>Your account has been created. Please wait for the admin to approve your account before you can log in.</p>
        <p class="sub-note">You'll be able to login once admin approves your registration.</p>
        <a routerLink="/auth/login" class="btn-primary">Go to Login</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg { min-height:100vh; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); display:flex; align-items:center; justify-content:center; padding:20px; }
    .auth-card { background:#fff; border-radius:20px; padding:40px; width:100%; max-width:500px; box-shadow:0 30px 60px rgba(0,0,0,0.4); }
    .auth-logo { text-align:center; margin-bottom:28px; }
    .logo-icon { font-size:40px; }
    .auth-logo h1 { font-size:24px; font-weight:800; color:#1a237e; margin:8px 0 4px; }
    .auth-logo p { color:#666; font-size:14px; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .form-group { margin-bottom:18px; }
    label { display:block; font-weight:600; font-size:13px; color:#333; margin-bottom:6px; }
    input, select { width:100%; padding:11px 14px; border:2px solid #e0e0e0; border-radius:10px; font-size:14px; box-sizing:border-box; }
    input:focus, select:focus { outline:none; border-color:#3f51b5; }
    .info-box { background:#e8eaf6; color:#3f51b5; padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; border-left:4px solid #3f51b5; }
    .btn-primary { display:block; width:100%; padding:14px; background:linear-gradient(135deg,#3f51b5,#1a237e); color:#fff; border:none; border-radius:10px; font-size:16px; font-weight:700; cursor:pointer; text-align:center; text-decoration:none; margin-top:8px; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .error-msg { background:#ffebee; color:#c62828; padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; }
    .auth-footer { text-align:center; margin-top:20px; color:#666; font-size:14px; }
    .auth-footer a { color:#3f51b5; font-weight:600; text-decoration:none; }
    .success-card { text-align:center; }
    .success-icon { font-size:60px; margin-bottom:16px; }
    .success-card h2 { color:#2e7d32; font-size:22px; margin-bottom:12px; }
    .success-card p { color:#555; font-size:15px; line-height:1.6; }
    .sub-note { font-size:13px; color:#999; }
  `]
})
export class RegisterComponent {
  model = { fullName: '', email: '', phoneNumber: '', password: '', role: 2 };
  loading = false;
  errorMsg = '';
  registered = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.register(this.model).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          if (this.model.role === 1) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.registered = true;
          }
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
