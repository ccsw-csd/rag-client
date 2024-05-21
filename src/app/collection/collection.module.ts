import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionListComponent } from './views/collection-list/collection-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CollectionEditComponent } from './views/collection-edit/collection-edit.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionEditComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    TranslateModule
  ]
})
export class CollectionModule { }
