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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { CollectionConfigurationComponent } from './views/collection-configuration/collection-configuration.component';
import { CollectionPromptComponent } from './views/collection-prompt/collection-prompt.component';
import { CodeEditorModule } from '@ngstack/code-editor';



@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionEditComponent,
    CollectionConfigurationComponent,
    CollectionPromptComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    FieldsetModule,
    TranslateModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    SliderModule,
    PasswordModule,
    CheckboxModule,    
    CodeEditorModule.forChild(),
  ]
})
export class CollectionModule { }
