import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageComponent } from './views/storage/storage.component';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeEditorModule } from '@ngstack/code-editor';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    StorageComponent
  ],
  imports: [
    CommonModule,
    FieldsetModule,
    TreeModule,
    ConfirmDialogModule,
    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco'
    }),
  ]
})
export class StorageModule { }
