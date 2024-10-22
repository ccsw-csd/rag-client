import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpInterceptorService } from './core/services/http-interceptor.service';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { LoginModule } from './login/login.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionModule } from './collection/collection.module';
import { StorageModule } from './storage/storage.module';
import { ChatModule } from './chat/chat.module';
import { PromptModule } from './prompt/prompt.module';
import { PromptLoaderResolverService } from './prompt/services/prompt-loader.resolver.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClipboardButtonComponent, ClipboardOptions, MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { CodeEditorModule } from '@ngstack/code-editor';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    CollectionModule,
    StorageModule,
    PromptModule,
    DashboardModule,
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: ClipboardOptions,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
      markedOptions: {        
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: false,
        }
      },
    }),
  ],
  providers: [
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    DialogService,
    MessageService,
    RefreshTokenResolverService,
    PromptLoaderResolverService,
    DatePipe,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule { }

