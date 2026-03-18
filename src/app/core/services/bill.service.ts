import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Bill, BillFilter, BillListItem, CreateBillRequest, PagedResult } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BillService {
  private apiUrl = `${environment.apiUrl}/bill`;
  constructor(private http: HttpClient) {}

  createBill(req: CreateBillRequest): Observable<ApiResponse<Bill>> {
    return this.http.post<ApiResponse<Bill>>(this.apiUrl, req);
  }

  getBill(id: number): Observable<ApiResponse<Bill>> {
    return this.http.get<ApiResponse<Bill>>(`${this.apiUrl}/${id}`);
  }

  getAllBills(filter: BillFilter): Observable<ApiResponse<PagedResult<BillListItem>>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.customerName) params = params.set('customerName', filter.customerName);
    if (filter.paymentMode) params = params.set('paymentMode', filter.paymentMode);
    return this.http.get<ApiResponse<PagedResult<BillListItem>>>(this.apiUrl, { params });
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  savePdf(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/${id}/save-pdf`, {});
  }
}
