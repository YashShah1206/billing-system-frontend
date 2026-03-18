# BillPro - Angular Frontend

## Tech Stack
- **Angular 17** (Standalone Components, Lazy Loading)
- **TypeScript 5.4**
- No external UI library — pure custom CSS

## Prerequisites
- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`
- Backend API running at `http://localhost:5000`

## Setup

```bash
cd BillingSystem-Angular
npm install
ng serve
```

App runs at: **http://localhost:4200**

## Features by Role

### 👤 User (Billing Staff)
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /user/dashboard | Welcome screen with quick actions |
| Create Bill | /user/billing | Full billing form with GST calc |
| My Bills | /user/bills | View & download own bills |

### 🔐 Admin
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /admin/dashboard | KPIs + stock alerts |
| User Management | /admin/users | Approve/Reject/Block users |
| Products | /admin/products | Add/Edit/Delete products |
| Suppliers | /admin/suppliers | Manage vendors |
| Purchase Orders | /admin/purchases | Record stock purchases |
| All Bills | /admin/bills | View all bills, download PDF |
| Portfolio | /admin/portfolio | Daily/Weekly/Monthly/Quarterly/Yearly P&L |
| Tax Reports | /admin/tax | GSTR-1, GSTR-3B, Income Tax + Excel export |
| Shop Settings | /admin/shop | Shop name, GSTIN, bank details |

## Architecture
```
src/
├── app/
│   ├── core/
│   │   ├── models/models.ts          # All TypeScript interfaces
│   │   ├── services/                 # API services (auth, bill, product, portfolio, tax, shop)
│   │   ├── guards/auth.guard.ts      # authGuard, adminGuard, guestGuard
│   │   └── interceptors/             # JWT auth interceptor
│   ├── shared/
│   │   └── components/
│   │       └── sidebar.component.ts  # Collapsible sidebar (admin/user aware)
│   ├── features/
│   │   ├── auth/                     # Login, Register
│   │   ├── admin/                    # All admin pages
│   │   └── user/                     # User pages
│   ├── app.routes.ts                 # Lazy-loaded route config
│   ├── app.config.ts                 # Angular providers
│   └── app.component.ts              # Root component
└── environments/
    ├── environment.ts                # Dev (http://localhost:5000/api)
    └── environment.prod.ts           # Production
```

## Changing the API URL
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://YOUR_SERVER:5000/api'
};
```

## Build for Production
```bash
ng build --configuration production
# Output: dist/billing-system/
```
Deploy the `dist/billing-system/` folder to any web server (Nginx, IIS, Apache).

## Default Login
- **Admin**: admin@billing.com / Admin@123

## Bill PDF Flow
1. User creates bill → Bill saved in DB
2. Click "Download PDF" → API generates PDF on the fly (QuestPDF) → Browser downloads it
3. Click "Save PDF" → PDF saved on server: `Bills/{Year}/{MM-Month}/{DD}/INV-xxx_Customer.pdf`

## GST Auto-Detection
The billing form automatically detects:
- **Customer State = Shop State** → CGST + SGST (split equally)  
- **Customer State ≠ Shop State** → IGST (full rate)

## User Approval Flow
```
Register → Status: Pending
Admin approves → Status: Approved → Can login & create bills
Admin rejects → Status: Rejected → Cannot login
Admin blocks → Status: Blocked → Cannot login
```
