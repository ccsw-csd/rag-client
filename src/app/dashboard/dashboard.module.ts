import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PromptModule } from '../prompt/prompt.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    ChartModule,
    PromptModule,
    TranslateModule,
  ]
})
export class DashboardModule { }
