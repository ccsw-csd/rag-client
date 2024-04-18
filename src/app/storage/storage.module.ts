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
import { ChunkDialogComponent } from './views/chunk-dialog/chunk-dialog.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreeTableModule } from 'primeng/treetable';
import { UploadDialogComponent } from './views/upload-dialog/upload-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
  declarations: [
    StorageComponent, 
    ChunkDialogComponent,
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
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco'
    }),
    TableModule,
    DynamicDialogModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
  ]
})
export class StorageModule { }
