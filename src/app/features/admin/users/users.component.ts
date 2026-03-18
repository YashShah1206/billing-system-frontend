import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="main">
        <div class="page-header">
          <h1>👥 User Management</h1>
          <div class="filter-tabs">
            <button *ngFor="let s of statuses" [class.active]="filterStatus===s" (click)="filterStatus=s">{{ s }}</button>
          </div>
        </div>
        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th>
                <th>Status</th><th>Registered</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of filteredUsers; let i=index">
                <td>{{ i+1 }}</td>
                <td><strong>{{ u.fullName }}</strong></td>
                <td>{{ u.email }}</td>
                <td>{{ u.phoneNumber }}</td>
                <td><span class="role-badge" [class.admin]="u.role==='Admin'">{{ u.role }}</span></td>
                <td><span class="status-badge" [ngClass]="u.status.toLowerCase()">{{ u.status }}</span></td>
                <td>{{ u.createdAt | date:'dd MMM yyyy' }}</td>
                <td class="actions">
                  <button class="btn-approve" *ngIf="u.status==='Pending' || u.status==='Rejected' || u.status==='Blocked'" (click)="updateStatus(u.id, 1)">✅ Approve</button>
                  <button class="btn-reject" *ngIf="u.status==='Pending' || u.status==='Approved'" (click)="updateStatus(u.id, 2)">❌ Reject</button>
                  <button class="btn-block" *ngIf="u.status==='Approved'" (click)="updateStatus(u.id, 3)">🔒 Block</button>
                </td>
              </tr>
              <tr *ngIf="!filteredUsers.length">
                <td colspan="8" class="empty">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pending-banner" *ngIf="pendingCount > 0">
          ⚠️ <strong>{{ pendingCount }} user(s)</strong> are waiting for approval
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { display:flex; height:100vh; overflow:hidden; background:#f5f6fa; }
    .main { flex:1; overflow-y:auto; padding:28px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
    .page-header h1 { font-size:24px; font-weight:800; color:#1a237e; margin:0; }
    .filter-tabs { display:flex; gap:8px; }
    .filter-tabs button { padding:7px 16px; border:2px solid #e0e0e0; background:#fff; border-radius:20px; cursor:pointer; font-size:13px; transition:all 0.2s; }
    .filter-tabs button.active { border-color:#3f51b5; background:#3f51b5; color:#fff; }
    .table-card { background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    th { background:#1a237e; color:#fff; padding:12px 14px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; }
    td { padding:13px 14px; border-bottom:1px solid #f0f0f0; font-size:14px; }
    tr:hover td { background:#f8f9ff; }
    tr:last-child td { border-bottom:none; }
    .role-badge { padding:3px 10px; border-radius:12px; font-size:12px; font-weight:700; background:#e8eaf6; color:#3f51b5; }
    .role-badge.admin { background:#1a237e; color:#fff; }
    .status-badge { padding:3px 10px; border-radius:12px; font-size:12px; font-weight:700; }
    .status-badge.pending { background:#fff8e1; color:#f57f17; }
    .status-badge.approved { background:#e8f5e9; color:#2e7d32; }
    .status-badge.rejected { background:#ffebee; color:#c62828; }
    .status-badge.blocked { background:#fce4ec; color:#880e4f; }
    .actions { display:flex; gap:6px; flex-wrap:wrap; }
    .btn-approve, .btn-reject, .btn-block { padding:5px 12px; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; }
    .btn-approve { background:#e8f5e9; color:#2e7d32; }
    .btn-approve:hover { background:#2e7d32; color:#fff; }
    .btn-reject { background:#ffebee; color:#c62828; }
    .btn-reject:hover { background:#c62828; color:#fff; }
    .btn-block { background:#fce4ec; color:#880e4f; }
    .btn-block:hover { background:#880e4f; color:#fff; }
    .empty { text-align:center; color:#999; padding:32px; }
    .pending-banner { background:#fff8e1; border:1px solid #ffe082; border-radius:12px; padding:14px 20px; margin-top:20px; color:#f57f17; }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filterStatus = 'All';
  statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Blocked'];

  get filteredUsers() {
    return this.filterStatus === 'All' ? this.users : this.users.filter(u => u.status === this.filterStatus);
  }
  get pendingCount() { return this.users.filter(u => u.status === 'Pending').length; }

  constructor(private authService: AuthService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.authService.getAllUsers().subscribe(res => { if (res.success) this.users = res.data; });
  }

  updateStatus(userId: number, status: number) {
    this.authService.updateUserStatus(userId, status).subscribe(res => {
      if (res.success) this.loadUsers();
    });
  }
}
