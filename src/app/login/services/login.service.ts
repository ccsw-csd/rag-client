import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseCredentials } from 'src/app/core/models/ResponseCredentials';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  authenticate(username: string, password: string): Observable<ResponseCredentials> {
    this.authService.clearCredentials();    
    return this.http.post<ResponseCredentials>(environment.sso + '/authenticate', {username:username, password: password});
  }

  putSSOCredentials(res: ResponseCredentials) {
    this.authService.putSSOCredentials(res);
  }
  
}

