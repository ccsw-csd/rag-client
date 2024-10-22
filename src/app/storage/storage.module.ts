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
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreeTableModule } from 'primeng/treetable';
import { UploadDialogComponent } from './views/upload-dialog/upload-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    StorageComponent, 
    UploadDialogComponent
  ],
  imports: [
    CommonModule,
    FieldsetModule,
    TreeModule,
    TreeTableModule,
    ConfirmDialogModule,
    ButtonModule,
    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    CodeEditorModule.forChild(),
    TableModule,
    DynamicDialogModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    TranslateModule,
    DropdownModule,
    DialogModule,
  ]
})
export class StorageModule { }
