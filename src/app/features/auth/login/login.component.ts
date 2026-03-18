import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-bg">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">🧾</div>
          <h1>BillPro</h1>
          <p>Professional Billing System</p>
        </div>
        <form (ngSubmit)="onLogin()" #f="ngForm">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
          </div>
          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="auth-footer">
          Don't have an account? <a routerLink="/auth/register">Register here</a>
        </div>
        <div class="default-creds">
          <small>Default Admin: admin&#64;billing.com / Admin&#64;123</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg { min-height:100vh; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); display:flex; align-items:center; justify-content:center; }
    .auth-card { background:#fff; border-radius:20px; padding:48px 40px; width:100%; max-width:420px; box-shadow:0 30px 60px rgba(0,0,0,0.4); }
    .auth-logo { text-align:center; margin-bottom:32px; }
    .logo-icon { font-size:48px; margin-bottom:8px; }
    .auth-logo h1 { font-size:28px; font-weight:800; color:#1a237e; margin:0; }
    .auth-logo p { color:#666; font-size:14px; margin:4px 0 0; }
    .form-group { margin-bottom:20px; }
    label { display:block; font-weight:600; font-size:13px; color:#333; margin-bottom:8px; }
    input { width:100%; padding:12px 16px; border:2px solid #e0e0e0; border-radius:10px; font-size:14px; transition:border-color 0.2s; box-sizing:border-box; }
    input:focus { outline:none; border-color:#3f51b5; }
    .btn-primary { width:100%; padding:14px; background:linear-gradient(135deg, #3f51b5, #1a237e); color:#fff; border:none; border-radius:10px; font-size:16px; font-weight:700; cursor:pointer; transition:opacity 0.2s; margin-top:8px; }
    .btn-primary:hover { opacity:0.9; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .error-msg { background:#ffebee; color:#c62828; padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; }
    .auth-footer { text-align:center; margin-top:24px; color:#666; font-size:14px; }
    .auth-footer a { color:#3f51b5; font-weight:600; text-decoration:none; }
    .default-creds { text-align:center; margin-top:12px; color:#999; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          const role = res.data.user.role;
          this.router.navigate([role === 'Admin' ? '/admin/dashboard' : '/user/dashboard']);
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
