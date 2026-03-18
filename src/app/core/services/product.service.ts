import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Category, Product, PurchaseOrder, StockSummary, Supplier } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Product[]>> { return this.http.get<ApiResponse<Product[]>>(this.apiUrl); }
  getById(id: number): Observable<ApiResponse<Product>> { return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`); }
  create(p: any): Observable<ApiResponse<Product>> { return this.http.post<ApiResponse<Product>>(this.apiUrl, p); }
  update(id: number, p: any): Observable<ApiResponse<Product>> { return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, p); }
  delete(id: number): Observable<ApiResponse<any>> { return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`); }
  getStockSummary(): Observable<ApiResponse<StockSummary>> { return this.http.get<ApiResponse<StockSummary>>(`${this.apiUrl}/stock-summary`); }

  getCategories(): Observable<ApiResponse<Category[]>> { return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`); }
  createCategory(c: any): Observable<ApiResponse<Category>> { return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, c); }

  getSuppliers(): Observable<ApiResponse<Supplier[]>> { return this.http.get<ApiResponse<Supplier[]>>(`${this.apiUrl}/suppliers`); }
  createSupplier(s: any): Observable<ApiResponse<Supplier>> { return this.http.post<ApiResponse<Supplier>>(`${this.apiUrl}/suppliers`, s); }

  getPurchaseOrders(): Observable<ApiResponse<PurchaseOrder[]>> { return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.apiUrl}/purchases`); }
  getPurchaseOrder(id: number): Observable<ApiResponse<PurchaseOrder>> { return this.http.get<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/purchases/${id}`); }
  createPurchaseOrder(po: any): Observable<ApiResponse<PurchaseOrder>> { return this.http.post<ApiResponse<PurchaseOrder>>(`${this.apiUrl}/purchases`, po); }
}
