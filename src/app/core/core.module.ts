import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SlideMenuModule } from 'primeng/slidemenu';
import {MenuModule} from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';

import { LayoutComponent } from './views/layout/layout.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { HeaderComponent } from './views/layout/header/header.component';
import { NavComponent } from './views/layout/nav/nav.component';
 
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DynamicDialogModule,
    SidebarModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    MenuModule,
    SlideMenuModule,
    PanelMenuModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    DropdownModule,
  ],
})
export class CoreModule { }
