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
import { PromptViewComponent } from './prompt/views/prompt-view/prompt-view.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    resolve: {credentials: RefreshTokenResolverService, collections: CollectionResolverService},
    canActivate: [AuthGuard],
    children: [
      { path: 'main', component: ChatComponent },
      { path: 'prompt', component: PromptViewComponent },
      { path: 'storage', component: StorageComponent},
      { path: 'collections', component: CollectionListComponent},
      { path: '**', redirectTo: 'storage', pathMatch: 'full' },
    ]
  },  
  { path: '**', redirectTo: '', pathMatch: 'full' }
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
