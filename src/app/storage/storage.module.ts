import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageComponent } from './views/storage/storage.component';
import { FieldsetModule } from 'primeng/fieldset';
import {ListboxModule} from 'primeng/listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';


@NgModule({
  declarations: [
    StorageComponent
  ],
  imports: [
    CommonModule,
    FieldsetModule,
    ListboxModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
  ]
})
export class StorageModule { }
