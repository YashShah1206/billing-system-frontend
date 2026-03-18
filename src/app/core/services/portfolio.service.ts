import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PortfolioRequest, PortfolioSummary } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;
  constructor(private http: HttpClient) {}

  getPortfolio(req: PortfolioRequest): Observable<ApiResponse<PortfolioSummary>> {
    let params = new HttpParams().set('period', req.period);
    if (req.month) params = params.set('month', req.month);
    if (req.year) params = params.set('year', req.year);
    if (req.quarter) params = params.set('quarter', req.quarter);
    if (req.fromDate) params = params.set('fromDate', req.fromDate);
    if (req.toDate) params = params.set('toDate', req.toDate);
    return this.http.get<ApiResponse<PortfolioSummary>>(this.apiUrl, { params });
  }
}
