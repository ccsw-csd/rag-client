import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/views/layout/layout.component';
import { LoginComponent } from './login/views/login/login.component';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { AuthGuard } from './core/services/auth.guard';
import { CollectionListComponent } from './collection/collection-list/collection-list.component';
import { ChatComponent } from './chat/views/chat/chat.component';
import { StorageComponent } from './storage/views/storage/storage.component';
import { CollectionResolverService } from './core/services/collection-resolver.service';
import { PromptListComponent } from './prompt/views/prompt-list/prompt-list.component';
import { PromptEditComponent } from './prompt/views/prompt-edit/prompt-edit.component';
import { PromptLoaderResolverService } from './prompt/services/prompt-loader.resolver.service';
import { DashboardComponent } from './dashboard/views/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    resolve: {credentials: RefreshTokenResolverService, collections: CollectionResolverService},
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'main', component: PromptListComponent },
      { path: 'prompt', component: PromptListComponent },
      { path: 'prompt/edit/:id', component: PromptEditComponent, resolve: {prompt: PromptLoaderResolverService}},
      { path: 'prompt/edit', component: PromptEditComponent},      
      { path: 'dashboard', component: DashboardComponent, data:{role:['ADMIN']} },
      { path: 'chat', component: ChatComponent },
      { path: 'storage', component: StorageComponent},
      { path: 'collections', component: CollectionListComponent},
      { path: '**', redirectTo: 'prompt', pathMatch: 'full' },
    ]
  },  
  { path: '**', redirectTo: 'prompt', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
