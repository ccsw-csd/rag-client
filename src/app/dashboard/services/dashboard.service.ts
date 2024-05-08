import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardStats } from '../models/DasboardStats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
  ) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(environment.server + '/dashboard');
  }

}
