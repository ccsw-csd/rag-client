import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ResponseCredentials } from '../models/ResponseCredentials';

@Injectable()
export class RefreshTokenResolverService implements Resolve<any> {
  constructor(private http: HttpClient,
    private authService: AuthService,) { }

  /**
   * resolve method
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot): Observable<ResponseCredentials> {
    return this.http.post<ResponseCredentials>(environment.sso + '/refresh/', {'token':this.authService.getSSOToken()});
  }

}