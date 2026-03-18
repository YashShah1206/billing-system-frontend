// ===================== AUTH =====================
export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'Admin' | 'User';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  createdAt: string;
  approvedAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number; // 1=Admin, 2=User
}

// ===================== PRODUCT =====================
export interface Product {
  id: number;
  productName: string;
  productCode: string;
  barcode?: string;
  description?: string;
  unit: string;
  buyingPrice: number;
  sellingPrice: number;
  mrp: number;
  gstRate: number;
  cessRate: number;
  isGstInclusive: boolean;
  hsnCode: number;
  currentStock: number;
  minStockAlert: number;
  categoryId: number;
  categoryName: string;
  supplierId?: number;
  supplierName?: string;
  isLowStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
}

export interface Supplier {
  id: number;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: number;
  purchaseBillNumber: string;
  purchaseDate: string;
  supplierName: string;
  subTotal: number;
  totalGst: number;
  totalCess: number;
  totalAmount: number;
  createdBy: string;
  createdAt: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  buyingPrice: number;
  gstRate: number;
  gstAmount: number;
  cessRate: number;
  cessAmount: number;
  totalAmount: number;
}

export interface StockSummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  lowStockProducts: Product[];
}

// ===================== BILL =====================
export interface Bill {
  id: number;
  billNumber: string;
  billDate: string;
  financialYear: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerGstNumber: string;
  customerState: string;
  subTotal: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  roundOff: number;
  totalAmount: number;
  paymentMode: string;
  isPaid: boolean;
  gstType: string;
  createdBy: string;
  createdByUserId: number;
  createdAt: string;
  pdfPath?: string;
  items: BillItem[];
  shopDetails?: ShopDetails;
}

export interface BillItem {
  id: number;
  productId: number;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
  mrp: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  cessRate: number;
  cessAmount: number;
  totalAmount: number;
}

export interface BillListItem {
  id: number;
  billNumber: string;
  billDate: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMode: string;
  isPaid: boolean;
  createdBy: string;
  hasPdf: boolean;
}

export interface CreateBillRequest {
  billDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerGstNumber: string;
  customerState: string;
  discountPercent: number;
  paymentMode: string;
  isPaid: boolean;
  gstType: number; // 1=CGST_SGST, 2=IGST
  items: CreateBillItemRequest[];
}

export interface CreateBillItemRequest {
  productId: number;
  quantity: number;
  sellingPrice: number;
  discountPercent: number;
}

export interface ShopDetails {
  shopName: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  termsAndConditions: string;
  logoPath?: string;
}

export interface BillFilter {
  fromDate?: string;
  toDate?: string;
  customerName?: string;
  paymentMode?: string;
  isPaid?: boolean;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===================== PORTFOLIO =====================
export interface PortfolioRequest {
  period: number; // 1=Daily,2=Weekly,3=Monthly,4=Quarterly,5=Yearly,6=Custom
  month?: number;
  year?: number;
  quarter?: number;
  fromDate?: string;
  toDate?: string;
}

export interface PortfolioSummary {
  periodLabel: string;
  fromDate: string;
  toDate: string;
  totalSales: number;
  totalPurchases: number;
  grossProfit: number;
  totalDiscount: number;
  totalTaxCollected: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalCess: number;
  totalBills: number;
  totalItemsSold: number;
  averageBillValue: number;
  profitMarginPercent: number;
  breakdown: PeriodBreakdown[];
  topProducts: TopProduct[];
  paymentBreakdown: PaymentModeBreakdown[];
}

export interface PeriodBreakdown {
  label: string;
  sales: number;
  purchases: number;
  profit: number;
  billCount: number;
}

export interface TopProduct {
  productName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

export interface PaymentModeBreakdown {
  paymentMode: string;
  count: number;
  amount: number;
}

// ===================== TAX =====================
export interface TaxReportRequest {
  reportType: number; // 1=GSTR1, 2=GSTR3B, 3=IncomeTax
  fromDate: string;
  toDate: string;
}

export interface TaxReport {
  reportTitle: string;
  period: string;
  fromDate: string;
  toDate: string;
  gstNumber: string;
  panNumber: string;
  shopName: string;
  totalTaxableSales: number;
  totalCgstCollected: number;
  totalSgstCollected: number;
  totalIgstCollected: number;
  totalCessCollected: number;
  totalOutputTax: number;
  totalTaxablePurchases: number;
  totalInputCgst: number;
  totalInputSgst: number;
  totalInputIgst: number;
  totalInputCess: number;
  totalInputTax: number;
  netTaxPayable: number;
  rateWiseSummary: GstRateWiseSummary[];
  salesLineItems: SalesTaxLineItem[];
  purchaseLineItems: PurchaseTaxLineItem[];
}

export interface GstRateWiseSummary {
  gstRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTax: number;
}

export interface SalesTaxLineItem {
  billNumber: string;
  billDate: string;
  customerName: string;
  customerGstin: string;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  invoiceValue: number;
}

export interface PurchaseTaxLineItem {
  purchaseBillNumber: string;
  purchaseDate: string;
  supplierName: string;
  supplierGstin: string;
  taxableAmount: number;
  inputCgst: number;
  inputSgst: number;
  inputIgst: number;
  inputCess: number;
  totalAmount: number;
}

export interface IncomeTaxSummary {
  financialYear: number;
  totalRevenue: number;
  totalPurchases: number;
  grossProfit: number;
  totalDiscount: number;
  netProfitBeforeTax: number;
  monthlySummary: MonthlyIncomeSummary[];
}

export interface MonthlyIncomeSummary {
  month: number;
  monthName: string;
  revenue: number;
  purchases: number;
  profit: number;
}

// ===================== COMMON =====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  termsAndConditions: string;
  logoPath?: string;
}
