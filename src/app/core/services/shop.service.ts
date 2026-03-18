import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Shop } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private apiUrl = `${environment.apiUrl}/shop`;
  constructor(private http: HttpClient) {}
  getShop(): Observable<ApiResponse<Shop>> { return this.http.get<ApiResponse<Shop>>(this.apiUrl); }
  updateShop(shop: Shop): Observable<ApiResponse<Shop>> { return this.http.put<ApiResponse<Shop>>(this.apiUrl, shop); }
}
