import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private auth: AuthService, 
    private translateService: TranslateService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token: string | null = this.auth.getSSOToken();

    if (token != null) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage;
          switch (error.status) {
            case 400:
              errorMessage = this.translateService.instant('errors.user-error') + error.error;
              break;
            case 401:
            case 403:
              this.auth.logout();
              errorMessage = this.translateService.instant('errors.credentials');
              break;
            case 404:
              errorMessage = this.translateService.instant('errors.not-found');
              break;
            case 415:
              errorMessage = this.translateService.instant('errors.invalid-element');
              break;
            case 422:
              errorMessage = this.translateService.instant('errors.not-processed');
              break;
            case 500:
            default:
              errorMessage = this.translateService.instant('errors.server-error');
          }
          return throwError(() => new Error(errorMessage));
        })
      );
    }

    return next.handle(req);
  }
}
