import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, IncomeTaxSummary, TaxReport, TaxReportRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private apiUrl = `${environment.apiUrl}/tax`;
  constructor(private http: HttpClient) {}

  getTaxReport(req: TaxReportRequest): Observable<ApiResponse<TaxReport>> {
    let params = new HttpParams()
      .set('reportType', req.reportType)
      .set('fromDate', req.fromDate)
      .set('toDate', req.toDate);
    return this.http.get<ApiResponse<TaxReport>>(`${this.apiUrl}/report`, { params });
  }

  exportTaxReport(req: TaxReportRequest): Observable<Blob> {
    let params = new HttpParams()
      .set('reportType', req.reportType)
      .set('fromDate', req.fromDate)
      .set('toDate', req.toDate);
    return this.http.get(`${this.apiUrl}/report/export`, { params, responseType: 'blob' });
  }

  getIncomeTax(financialYear: number): Observable<ApiResponse<IncomeTaxSummary>> {
    return this.http.get<ApiResponse<IncomeTaxSummary>>(`${this.apiUrl}/income-tax/${financialYear}`);
  }
}
