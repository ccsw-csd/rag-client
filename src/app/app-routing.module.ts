import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/views/layout/layout.component';
import { LoginComponent } from './login/views/login/login.component';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { AuthGuard } from './core/services/auth.guard';
import { DashboardComponent } from './dashboard/views/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    resolve: {credentials: RefreshTokenResolverService},
    canActivate: [AuthGuard],
    children: [
      { path: 'main', component: DashboardComponent },
      { path: '**', redirectTo: 'main', pathMatch: 'full' },
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
