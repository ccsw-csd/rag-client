import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ChatModule } from './chat/chat.module';
import { PreferencesModule } from './preferences/preferences.module';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpInterceptorService } from './core/services/http-interceptor.service';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { LoginModule } from './login/login.module';
import { StorageModule } from './storage/storage.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionModule } from './collection/collection.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    LoginModule,
    ChatModule,
    StorageModule,
    PreferencesModule,
    CollectionModule
  ],
  providers: [
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    DialogService,
    MessageService,
    RefreshTokenResolverService,
    DatePipe,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }